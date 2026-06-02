from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.usuario import Usuario
from app.schemas.usuario import Usuario as UsuarioSchema

router = APIRouter()

class UserRegister(BaseModel):
    nome: str
    email: EmailStr
    password: str

@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == user_data.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-mail já cadastrado."
        )
    
    hashed_pwd = get_password_hash(user_data.password)
    new_user = Usuario(
        nome=user_data.nome,
        email=user_data.email,
        hashed_password=hashed_pwd,
        perfil="Pesquisador"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(subject=new_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "nome": new_user.nome,
            "email": new_user.email,
            "perfil": new_user.perfil
        }
    }

@router.post("/login")
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "perfil": user.perfil
        }
    }

import httpx
from app.core.config import settings

# Simulação de endpoint para Microsoft/Google (OAuth2 callback)
@router.post("/social-login/{provider}")
def social_login(provider: str, token_data: dict, db: Session = Depends(get_db)):
    token = token_data.get("token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token não fornecido"
        )
    
    email = None
    name = None
    social_id = None

    if provider == "google":
        try:
            # Validar token com o Google User Info API (funciona com access token do popup flow)
            response = httpx.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10.0
            )
            if response.status_code != 200:
                # Fallback: tentar validar como ID token caso seja enviado um ID token
                response_id = httpx.get(
                    "https://oauth2.googleapis.com/tokeninfo",
                    params={"id_token": token},
                    timeout=10.0
                )
                if response_id.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Token Google inválido ou expirado"
                    )
                data = response_id.json()
            else:
                data = response.json()
            
            email = data.get("email")
            name = data.get("name") or data.get("given_name", "Usuário Google")
            social_id = data.get("sub")

        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Erro de comunicação com o Google: {str(e)}"
            )

    elif provider == "microsoft":
        try:
            # Validar access token chamando o endpoint do Microsoft Graph API /me
            response = httpx.get(
                "https://graph.microsoft.com/v1.0/me",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10.0
            )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Token Microsoft inválido ou expirado"
                )
            
            data = response.json()
            email = data.get("mail") or data.get("userPrincipalName")
            name = data.get("displayName") or "Usuário Microsoft"
            social_id = data.get("id")

        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Erro de comunicação com a Microsoft: {str(e)}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Provedor '{provider}' não suportado"
        )

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não foi possível obter o e-mail do provedor social"
        )

    # Buscar usuário por email
    user = db.query(Usuario).filter(Usuario.email == email).first()
    
    if user:
        # Se o usuário existe mas não tinha oauth vinculado, vincula agora
        if not user.oauth_provider:
            user.oauth_provider = provider
            user.oauth_id = social_id
            db.commit()
            db.refresh(user)
    else:
        # Criar novo usuário
        user = Usuario(
            nome=name,
            email=email,
            oauth_provider=provider,
            oauth_id=social_id,
            perfil="Pesquisador"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "perfil": user.perfil
        }
    }


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.publicacao import Publicacao as PublicacaoModel
from app.models.orientacao import Orientacao as OrientacaoModel
from app.models.financiamento import Financiamento as FinanciamentoModel
from app.schemas.academico_financeiro import (
    Publicacao, PublicacaoCreate,
    Orientacao, OrientacaoCreate,
    Financiamento, FinanciamentoCreate
)

router = APIRouter()

# Publicações
@router.get("/publicacoes", response_model=List[Publicacao])
def read_publicacoes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(PublicacaoModel).offset(skip).limit(limit).all()

@router.post("/publicacoes", response_model=Publicacao)
def create_publicacao(publicacao: PublicacaoCreate, db: Session = Depends(get_db)):
    db_pub = PublicacaoModel(**publicacao.model_dump())
    db.add(db_pub)
    db.commit()
    db.refresh(db_pub)
    return db_pub

# Orientações
@router.get("/orientacoes", response_model=List[Orientacao])
def read_orientacoes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(OrientacaoModel).offset(skip).limit(limit).all()

@router.post("/orientacoes", response_model=Orientacao)
def create_orientacao(orientacao: OrientacaoCreate, db: Session = Depends(get_db)):
    db_orient = OrientacaoModel(**orientacao.model_dump())
    db.add(db_orient)
    db.commit()
    db.refresh(db_orient)
    return db_orient

# Financiamentos
@router.get("/financiamentos", response_model=List[Financiamento])
def read_financiamentos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(FinanciamentoModel).offset(skip).limit(limit).all()

@router.post("/financiamentos", response_model=Financiamento)
def create_financiamento(financiamento: FinanciamentoCreate, db: Session = Depends(get_db)):
    db_fin = FinanciamentoModel(**financiamento.model_dump())
    db.add(db_fin)
    db.commit()
    db.refresh(db_fin)
    return db_fin

@router.delete("/publicacoes/{id}")
def delete_publicacao(id: int, db: Session = Depends(get_db)):
    db_obj = db.query(PublicacaoModel).filter(PublicacaoModel.id == id).first()
    if not db_obj:
        return {"error": "Não encontrado"}
    db.delete(db_obj)
    db.commit()
    return {"message": "Deletado"}

@router.delete("/orientacoes/{id}")
def delete_orientacao(id: int, db: Session = Depends(get_db)):
    db_obj = db.query(OrientacaoModel).filter(OrientacaoModel.id == id).first()
    if not db_obj:
        return {"error": "Não encontrado"}
    db.delete(db_obj)
    db.commit()
    return {"message": "Deletado"}

@router.delete("/financiamentos/{id}")
def delete_financiamento(id: int, db: Session = Depends(get_db)):
    db_obj = db.query(FinanciamentoModel).filter(FinanciamentoModel.id == id).first()
    if not db_obj:
        return {"error": "Não encontrado"}
    db.delete(db_obj)
    db.commit()
    return {"message": "Deletado"}

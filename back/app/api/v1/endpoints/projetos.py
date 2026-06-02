from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.projeto import Projeto as ProjetoModel
from app.schemas.projeto import Projeto, ProjetoCreate

router = APIRouter()

@router.get("/", response_model=List[Projeto])
def read_projetos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(ProjetoModel).offset(skip).limit(limit).all()

@router.post("/", response_model=Projeto)
def create_projeto(projeto: ProjetoCreate, db: Session = Depends(get_db)):
    db_projeto = ProjetoModel(**projeto.model_dump())
    db.add(db_projeto)
    db.commit()
    db.refresh(db_projeto)
    return db_projeto

@router.put("/{id}", response_model=Projeto)
def update_projeto(id: int, projeto: ProjetoCreate, db: Session = Depends(get_db)):
    db_proj = db.query(ProjetoModel).filter(ProjetoModel.id == id).first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    
    for key, value in projeto.model_dump().items():
        setattr(db_proj, key, value)
    
    db.commit()
    db.refresh(db_proj)
    return db_proj

@router.delete("/{id}")
def delete_projeto(id: int, db: Session = Depends(get_db)):
    db_proj = db.query(ProjetoModel).filter(ProjetoModel.id == id).first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    
    db.delete(db_proj)
    db.commit()
    return {"message": "Projeto deletado com sucesso"}

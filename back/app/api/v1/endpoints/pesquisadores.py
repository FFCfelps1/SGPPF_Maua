from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.pesquisador import Pesquisador as PesquisadorModel
from app.schemas.pesquisador import Pesquisador, PesquisadorCreate

router = APIRouter()

@router.get("/", response_model=List[Pesquisador])
def read_pesquisadores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    pesquisadores = db.query(PesquisadorModel).offset(skip).limit(limit).all()
    return pesquisadores

@router.post("/", response_model=Pesquisador)
def create_pesquisador(pesquisador: PesquisadorCreate, db: Session = Depends(get_db)):
    db_pesquisador = PesquisadorModel(**pesquisador.model_dump())
    db.add(db_pesquisador)
    db.commit()
    db.refresh(db_pesquisador)
    return db_pesquisador

@router.put("/{id}", response_model=Pesquisador)
def update_pesquisador(id: int, pesquisador: PesquisadorCreate, db: Session = Depends(get_db)):
    db_pesq = db.query(PesquisadorModel).filter(PesquisadorModel.id == id).first()
    if not db_pesq:
        raise HTTPException(status_code=404, detail="Pesquisador não encontrado")
    
    for key, value in pesquisador.model_dump().items():
        setattr(db_pesq, key, value)
    
    db.commit()
    db.refresh(db_pesq)
    return db_pesq

@router.delete("/{id}")
def delete_pesquisador(id: int, db: Session = Depends(get_db)):
    db_pesq = db.query(PesquisadorModel).filter(PesquisadorModel.id == id).first()
    if not db_pesq:
        raise HTTPException(status_code=404, detail="Pesquisador não encontrado")
    
    db.delete(db_pesq)
    db.commit()
    return {"message": "Pesquisador deletado com sucesso"}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.publicacao import Publicacao
from app.models.orientacao import Orientacao
from app.models.projeto import Projeto
from app.models.financiamento import Financiamento

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_pubs = db.query(func.count(Publicacao.id)).scalar()
    total_orients = db.query(func.count(Orientacao.id)).scalar()
    projetos_ativos = db.query(func.count(Projeto.id)).filter(Projeto.status == "Em Andamento").scalar()
    total_captado = db.query(func.sum(Financiamento.valor_aprovado)).scalar() or 0.0
    
    return {
        "totalPublicacoes": total_pubs,
        "totalOrientacoes": total_orients,
        "projetosAtivos": projetos_ativos,
        "valorTotalCaptado": total_captado,
        "ultimaAtualizacao": "02/06/2026"  # Mockada por enquanto
    }

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Orientacao(Base):
    __tablename__ = "orientacoes"

    id = Column(Integer, primary_key=True, index=True)
    aluno = Column(String, nullable=False)
    nivel = Column(String)  # iniciação científica, mestrado, doutorado, pós‑doc, TCC
    titulo_trabalho = Column(String)
    orientador_id = Column(Integer, ForeignKey("pesquisadores.id"))
    coorientador_id = Column(Integer, ForeignKey("pesquisadores.id"), nullable=True)
    data_inicio = Column(DateTime)
    data_conclusao = Column(DateTime, nullable=True)
    status = Column(String, default="Em Andamento")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    orientador = relationship("Pesquisador", foreign_keys=[orientador_id])
    coorientador = relationship("Pesquisador", foreign_keys=[coorientador_id])

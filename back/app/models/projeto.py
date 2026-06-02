from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Projeto(Base):
    __tablename__ = "projetos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    codigo_projeto = Column(String, unique=True, index=True)
    agencia_financiadora = Column(String)
    modalidade = Column(String)
    pesquisador_responsavel_id = Column(Integer, ForeignKey("pesquisadores.id"))
    data_inicio = Column(DateTime)
    data_termino = Column(DateTime)
    status = Column(String, default="Em Andamento")
    valor_aprovado = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    pesquisador_responsavel = relationship("Pesquisador", back_populates="projetos")
    publicacoes = relationship("Publicacao", secondary="projeto_publicacao", back_populates="projetos")
    financiamentos = relationship("Financiamento", back_populates="projeto")

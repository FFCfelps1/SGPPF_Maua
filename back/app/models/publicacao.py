from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Publicacao(Base):
    __tablename__ = "publicacoes"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    doi = Column(String, index=True)
    ano = Column(Integer)
    tipo = Column(String)
    periodico = Column(String)
    issn = Column(String)
    url = Column(String)
    fator_impacto = Column(Float)
    area_conhecimento = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    autores = relationship("Pesquisador", secondary="autores_publicacoes", back_populates="publicacoes")
    projetos = relationship("Projeto", secondary="projeto_publicacao", back_populates="publicacoes")

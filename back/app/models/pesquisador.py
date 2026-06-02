from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Pesquisador(Base):
    __tablename__ = "pesquisadores"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    orcid = Column(String)
    scholar_id = Column(String)
    lattes_url = Column(String)
    area_atuacao = Column(String)
    departamento = Column(String)
    status = Column(String, default="Ativo")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    usuario = relationship("Usuario", back_populates="pesquisador")
    projetos = relationship("Projeto", back_populates="pesquisador_responsavel")
    publicacoes = relationship("Publicacao", secondary="autores_publicacoes", back_populates="autores")
    grupos = relationship("Grupo", secondary="grupo_pesquisador", back_populates="membros")

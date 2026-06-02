from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class AutoresPublicacoes(Base):
    __tablename__ = "autores_publicacoes"
    
    publicacao_id = Column(Integer, ForeignKey("publicacoes.id"), primary_key=True)
    pesquisador_id = Column(Integer, ForeignKey("pesquisadores.id"), primary_key=True)
    ordem_autoria = Column(Integer)
    role = Column(String)

class ProjetoPublicacao(Base):
    __tablename__ = "projeto_publicacao"
    
    projeto_id = Column(Integer, ForeignKey("projetos.id"), primary_key=True)
    publicacao_id = Column(Integer, ForeignKey("publicacoes.id"), primary_key=True)

class GrupoPesquisador(Base):
    __tablename__ = "grupo_pesquisador"
    
    grupo_id = Column(Integer, ForeignKey("grupos.id"), primary_key=True)
    pesquisador_id = Column(Integer, ForeignKey("pesquisadores.id"), primary_key=True)
    data_vinculo = Column(DateTime(timezone=True), server_default=func.now())

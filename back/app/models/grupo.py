from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Grupo(Base):
    __tablename__ = "grupos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    coordenador_id = Column(Integer, ForeignKey("pesquisadores.id"))
    descricao = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    membros = relationship("Pesquisador", secondary="grupo_pesquisador", back_populates="grupos")

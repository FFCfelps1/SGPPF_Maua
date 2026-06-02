from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True) # Nullable para suportar OAuth2 futuro
    oauth_provider = Column(String, nullable=True)   # "microsoft" | "google" | None
    oauth_id = Column(String, nullable=True)          # ID único do provedor
    perfil = Column(String)  # Administrador, Coordenador, Pesquisador, Consultor
    instituicao_id = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    pesquisador = relationship("Pesquisador", back_populates="usuario", uselist=False)

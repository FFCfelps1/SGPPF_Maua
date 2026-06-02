from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Financiamento(Base):
    __tablename__ = "financiamentos"

    id = Column(Integer, primary_key=True, index=True)
    projeto_id = Column(Integer, ForeignKey("projetos.id"))
    agencia = Column(String)
    valor_aprovado = Column(Float, default=0.0)
    valor_recebido = Column(Float, default=0.0)
    moeda = Column(String, default="BRL")
    data_inicio = Column(DateTime)
    data_termino = Column(DateTime)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    projeto = relationship("Projeto", back_populates="financiamentos")

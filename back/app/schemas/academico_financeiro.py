from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

class PublicacaoBase(BaseModel):
    titulo: str
    doi: Optional[str] = None
    ano: Optional[int] = None
    tipo: Optional[str] = None
    periodico: Optional[str] = None
    issn: Optional[str] = None
    url: Optional[str] = None
    fator_impacto: Optional[float] = None
    area_conhecimento: Optional[str] = None

class PublicacaoCreate(PublicacaoBase):
    pass

class Publicacao(PublicacaoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class OrientacaoBase(BaseModel):
    aluno: str
    nivel: Optional[str] = None
    titulo_trabalho: Optional[str] = None
    status: Optional[str] = "Em Andamento"
    data_inicio: Optional[datetime] = None
    data_conclusao: Optional[datetime] = None

class OrientacaoCreate(OrientacaoBase):
    orientador_id: int
    coorientador_id: Optional[int] = None

class Orientacao(OrientacaoBase):
    id: int
    orientador_id: int
    coorientador_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class FinanciamentoBase(BaseModel):
    agencia: str
    valor_aprovado: float = 0.0
    valor_recebido: float = 0.0
    moeda: str = "BRL"
    status: Optional[str] = None
    data_inicio: Optional[datetime] = None
    data_termino: Optional[datetime] = None

class FinanciamentoCreate(FinanciamentoBase):
    projeto_id: int

class Financiamento(FinanciamentoBase):
    id: int
    projeto_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

class ProjetoBase(BaseModel):
    titulo: str
    codigo_projeto: Optional[str] = None
    agencia_financiadora: Optional[str] = None
    modalidade: Optional[str] = None
    data_inicio: Optional[datetime] = None
    data_termino: Optional[datetime] = None
    status: Optional[str] = "Em Andamento"
    valor_aprovado: float = 0.0

class ProjetoCreate(ProjetoBase):
    pesquisador_responsavel_id: int

class Projeto(ProjetoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List
from .usuario import Usuario

class PesquisadorBase(BaseModel):
    orcid: Optional[str] = None
    scholar_id: Optional[str] = None
    lattes_url: Optional[str] = None
    area_atuacao: Optional[str] = None
    departamento: Optional[str] = None
    status: Optional[str] = "Ativo"

class PesquisadorCreate(PesquisadorBase):
    usuario_id: int

class Pesquisador(PesquisadorBase):
    id: int
    usuario: Usuario
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

from fastapi import APIRouter
from app.api.v1.endpoints import pesquisadores, projetos, academico_financeiro, dashboard, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(pesquisadores.router, prefix="/pesquisadores", tags=["pesquisadores"])
api_router.include_router(projetos.router, prefix="/projetos", tags=["projetos"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(academico_financeiro.router, tags=["academico-financeiro"])

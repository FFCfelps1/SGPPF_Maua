from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SGPPF - Sistema de Gestão de Projetos, Publicações e Financiamentos"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./sgppf.db"

    # Security
    SECRET_KEY: str = "super-secret-key-change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # OAuth - Microsoft
    MICROSOFT_CLIENT_ID: str = ""
    MICROSOFT_TENANT_ID: str = "common"

    # OAuth - Google
    GOOGLE_CLIENT_ID: str = ""

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

from pydantic_settings import BaseSettings
from pathlib import Path
import os
from typing import List


def get_default_database_uri() -> str:
    if local_app_data := os.getenv("LOCALAPPDATA"):
        data_dir = Path(local_app_data) / "SGPPF"
    else:
        data_dir = Path(os.getenv("XDG_DATA_HOME", Path.home() / ".local" / "share")) / "sgppf"

    data_dir.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{(data_dir / 'sgppf.db').as_posix()}"


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SGPPF - Sistema de Gestão de Projetos, Publicações e Financiamentos"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = get_default_database_uri()

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

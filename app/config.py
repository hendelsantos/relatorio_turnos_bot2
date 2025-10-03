"""
Configurações da aplicação
"""
import os
from pathlib import Path

# Diretório base do projeto
BASE_DIR = Path(__file__).parent.parent

# Configurações do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./reports.db")

# Se usar PostgreSQL no Railway, ajustar URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configurações de upload
UPLOAD_DIR = BASE_DIR / "static" / "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

# Configurações do servidor
HOST = "0.0.0.0"
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# Configurações de produção
ENVIRONMENT = os.getenv("RAILWAY_ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT == "production"

# Criar diretórios necessários
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
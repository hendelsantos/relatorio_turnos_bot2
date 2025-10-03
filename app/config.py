"""
Configurações da aplicação
"""
import os
from pathlib import Path

# Diretório base do projeto
BASE_DIR = Path(__file__).parent

# Configurações do banco de dados
DATABASE_URL = "sqlite:///./reports.db"

# Configurações de upload
UPLOAD_DIR = BASE_DIR / "static" / "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

# Configurações do servidor
HOST = "0.0.0.0"
PORT = 8000
DEBUG = True

# Criar diretórios necessários
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
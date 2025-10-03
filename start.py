#!/usr/bin/env python3
"""
Script de inicialização para produção no Railway
"""
import os
import uvicorn
from app.database import engine
from app.models import models

def init_db():
    """Inicializa o banco de dados"""
    print("🔄 Inicializando banco de dados...")
    models.Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados inicializado!")

def main():
    """Função principal"""
    print("🚀 Iniciando Sistema de Relatórios por Turnos (Produção)")
    
    # Inicializar banco
    init_db()
    
    # Configurações
    host = "0.0.0.0"
    port = int(os.getenv("PORT", 8000))
    
    print(f"🌐 Servidor rodando em {host}:{port}")
    
    # Iniciar servidor
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        workers=1,
        access_log=True
    )

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Script para executar a aplicação FastAPI
"""
import uvicorn
from app.config import HOST, PORT, DEBUG

if __name__ == "__main__":
    print("🚀 Iniciando Sistema de Relatórios por Turnos...")
    print(f"📱 Acesse no celular: http://[seu-ip]:{PORT}")
    print(f"💻 Acesse no computador: http://localhost:{PORT}")
    print("🔄 Pressione Ctrl+C para parar")
    
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=DEBUG,
        reload_dirs=["app", "static", "templates"]
    )
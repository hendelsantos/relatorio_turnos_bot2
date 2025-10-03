from fastapi import FastAPI, Request, Form, File, UploadFile, Depends
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import os
import uuid
from datetime import datetime
from typing import Optional, List
import shutil

from app.database import get_db, engine
from app.models import models
from app.models.models import Report

# Criar as tabelas
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Relatórios por Turnos", version="1.0.0")

# Configurar arquivos estáticos e templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Criar diretório de uploads se não existir
os.makedirs("static/uploads", exist_ok=True)

@app.get("/health")
async def health_check():
    """Health check endpoint para Railway"""
    return {"status": "healthy", "service": "Sistema de Relatórios por Turnos"}

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Página inicial com seleção de turno e nome"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/reports", response_class=HTMLResponse)
async def reports_page(request: Request, turno: Optional[int] = None):
    """Página de relatórios com timeline"""
    return templates.TemplateResponse("reports.html", {
        "request": request, 
        "turno": turno
    })

@app.post("/api/reports")
async def create_report(
    turno: int = Form(...),
    usuario: str = Form(...),
    texto: str = Form(...),
    fotos: List[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Criar novo relatório com múltiplas fotos"""
    
    fotos_urls = []
    
    if fotos:
        for foto in fotos:
            if foto.filename:
                # Validar tipo de arquivo
                if not foto.content_type.startswith('image/'):
                    continue
                
                # Gerar nome único para a foto
                file_extension = foto.filename.split(".")[-1] if "." in foto.filename else "jpg"
                file_name = f"{uuid.uuid4()}.{file_extension}"
                file_path = f"static/uploads/{file_name}"
                
                # Salvar arquivo
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(foto.file, buffer)
                
                fotos_urls.append(f"/static/uploads/{file_name}")
    
    # Criar relatório no banco
    report = Report(
        turno=turno,
        usuario=usuario,
        texto=texto,
        fotos_urls=",".join(fotos_urls) if fotos_urls else None,
        data_criacao=datetime.now()
    )
    
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return JSONResponse({
        "success": True,
        "message": "Relatório criado com sucesso!",
        "report_id": report.id,
        "fotos_count": len(fotos_urls)
    })

@app.get("/api/reports")
async def get_reports(turno: Optional[int] = None, db: Session = Depends(get_db)):
    """Buscar relatórios com filtro opcional por turno"""
    
    query = db.query(Report)
    if turno:
        query = query.filter(Report.turno == turno)
    
    reports = query.order_by(Report.data_criacao.desc()).all()
    
    return [
        {
            "id": report.id,
            "turno": report.turno,
            "usuario": report.usuario,
            "texto": report.texto,
            "fotos_urls": report.fotos_urls.split(",") if report.fotos_urls else [],
            "data_criacao": report.data_criacao.isoformat(),
            "turno_nome": f"{report.turno}º Turno"
        }
        for report in reports
    ]

@app.delete("/api/reports/{report_id}")
async def delete_report(report_id: int, db: Session = Depends(get_db)):
    """Excluir um relatório específico"""
    
    # Buscar o relatório
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Relatório não encontrado"}
        )
    
    # Remover arquivos de fotos se existirem
    if report.fotos_urls:
        foto_urls = report.fotos_urls.split(",")
        for foto_url in foto_urls:
            try:
                file_path = foto_url.lstrip("/")
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Erro ao remover arquivo: {e}")
    
    # Excluir do banco
    db.delete(report)
    db.commit()
    
    return JSONResponse({
        "success": True,
        "message": "Relatório excluído com sucesso!"
    })

@app.get("/api/turnos")
async def get_turnos():
    """Lista os turnos disponíveis"""
    return [
        {"id": 1, "nome": "1º Turno", "horario": "06:00 - 14:20"},
        {"id": 2, "nome": "2º Turno", "horario": "14:20 - 22:00"},
        {"id": 3, "nome": "3º Turno", "horario": "22:00 - 06:00"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
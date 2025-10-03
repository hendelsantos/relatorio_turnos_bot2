from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Report(Base):
    """Modelo para relatórios de atividades"""
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    turno = Column(Integer, nullable=False)  # 1, 2 ou 3
    usuario = Column(String(100), nullable=False)
    texto = Column(Text, nullable=False)
    foto_url = Column(String(500), nullable=True)
    data_criacao = Column(DateTime, default=func.now())
    
    def __repr__(self):
        return f"<Report(id={self.id}, turno={self.turno}, usuario='{self.usuario}')>"
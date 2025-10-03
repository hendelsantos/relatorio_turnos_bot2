#!/usr/bin/env python3
"""
Script de migração do banco de dados.
Adiciona a coluna fotos_urls para suportar múltiplas fotos.
"""

import sqlite3
import os
import json

# Caminho do banco de dados
DB_PATH = 'reports.db'

def migrate_database():
    """Migra o banco de dados para a nova estrutura com múltiplas fotos."""
    
    print("🔄 Iniciando migração do banco de dados...")
    
    # Conecta ao banco
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Verifica se a coluna fotos_urls já existe
        cursor.execute("PRAGMA table_info(reports)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'fotos_urls' in columns:
            print("✅ Coluna fotos_urls já existe. Migração não necessária.")
            return
        
        # Verifica se existe a coluna foto_url (versão antiga)
        if 'foto_url' in columns:
            print("🔄 Migrando dados da coluna foto_url para fotos_urls...")
            
            # Adiciona a nova coluna
            cursor.execute("ALTER TABLE reports ADD COLUMN fotos_urls TEXT")
            
            # Migra os dados existentes
            cursor.execute("SELECT id, foto_url FROM reports WHERE foto_url IS NOT NULL")
            old_records = cursor.fetchall()
            
            for record_id, foto_url in old_records:
                # Converte a URL única em um array JSON
                fotos_array = [foto_url] if foto_url else []
                fotos_json = json.dumps(fotos_array)
                
                cursor.execute(
                    "UPDATE reports SET fotos_urls = ? WHERE id = ?",
                    (fotos_json, record_id)
                )
            
            print(f"✅ Migrados {len(old_records)} registros com fotos.")
            
            # Remove a coluna antiga (SQLite não suporta DROP COLUMN diretamente)
            # Vamos criar uma nova tabela e copiar os dados
            cursor.execute("""
                CREATE TABLE reports_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    turno VARCHAR(20) NOT NULL,
                    usuario VARCHAR(100) NOT NULL,
                    texto TEXT NOT NULL,
                    fotos_urls TEXT,
                    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Copia todos os dados para a nova tabela
            cursor.execute("""
                INSERT INTO reports_new (id, turno, usuario, texto, fotos_urls, data_criacao)
                SELECT id, turno, usuario, texto, fotos_urls, data_criacao
                FROM reports
            """)
            
            # Remove a tabela antiga e renomeia a nova
            cursor.execute("DROP TABLE reports")
            cursor.execute("ALTER TABLE reports_new RENAME TO reports")
            
            print("✅ Estrutura da tabela atualizada.")
        
        else:
            # Cria a tabela nova do zero
            print("🆕 Criando nova tabela com estrutura atualizada...")
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS reports (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    turno VARCHAR(20) NOT NULL,
                    usuario VARCHAR(100) NOT NULL,
                    texto TEXT NOT NULL,
                    fotos_urls TEXT,
                    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            print("✅ Nova tabela criada.")
        
        # Commit das mudanças
        conn.commit()
        print("✅ Migração concluída com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro durante a migração: {e}")
        conn.rollback()
        raise
    
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
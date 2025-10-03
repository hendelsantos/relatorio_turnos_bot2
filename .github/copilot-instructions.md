# Projeto Sistema de Relatórios de Atividades por Turnos

## Visão Geral
Sistema web para relatórios de atividades divididos por turnos de trabalho, permitindo que usuários colem textos do WhatsApp e anexem fotos.

## Tecnologias
- **Backend**: FastAPI (Python)
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Banco de Dados**: SQLite (inicial) / PostgreSQL (produção)
- **Estrutura**: Aplicação web responsiva e escalável

## Funcionalidades Principais
- [x] ✅ **Verificar arquivo copilot-instructions.md criado**
- [x] ✅ **Seleção de turno (1º, 2º, 3º turno)**
- [x] ✅ **Cadastro de nome do usuário**
- [x] ✅ **Interface para colar textos do WhatsApp**
- [x] ✅ **Upload de múltiplas fotos + clipboard paste**
- [x] ✅ **Visualização de relatórios por turno**
- [x] ✅ **Interface tipo rede social para relatórios**
- [x] ✅ **Sistema de exclusão de relatórios**
- [x] ✅ **Footer personalizado "Feito por Hendel"**
- [x] ✅ **Limpeza automática (24h) - Anti sobrecarga**

## ✅ PROJETO CONCLUÍDO

### Estrutura Criada:
- Backend FastAPI completo com API REST
- Frontend responsivo e moderno  
- Sistema de múltiplas fotos + drag & drop + clipboard paste
- Organização por turnos (06:00-14:20, 14:20-22:00, 22:00-06:00)
- Interface tipo rede social responsiva
- Banco de dados SQLite com migração automática
- Sistema de limpeza automática (relatórios > 24h)
- Footer personalizado e deploy Railway
- Sistema completamente escalável

### Como usar:
1. Execute: `python run.py`
2. Acesse: http://localhost:8000
3. No celular: http://[seu-ip]:8000

### Próximas Melhorias:
- Sistema de autenticação
- Filtros por data e usuário
- Exportação de relatórios
- Notificações push
- Dashboard administrativo
# Sistema de Relatórios de Atividades por Turnos

## Descrição
Sistema web moderno para relatórios de atividades divididos por turnos de trabalho. Os usuários podem colar textos do WhatsApp e anexar fotos relacionadas às suas atividades.

## Funcionalidades
- 📱 **Interface responsiva** - Funciona perfeitamente em celulares e computadores
- 👥 **Sistema de turnos** - Organização por 1º (06:00-14:20), 2º (14:20-22:00) e 3º turno (22:00-06:00)
- 📝 **Relatórios de texto** - Cole facilmente textos do WhatsApp
- 📸 **Upload de fotos** - Anexe imagens relacionadas às atividades
- 🌐 **Interface social** - Visualize relatórios como uma rede social
- ⚡ **Rápido e escalável** - Construído com FastAPI e tecnologias modernas

## Tecnologias Utilizadas
- **Backend**: FastAPI (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Upload**: Sistema de arquivos local
- **Estilo**: CSS Grid, Flexbox, Design responsivo

## Estrutura do Projeto
```
.
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicação principal FastAPI
│   ├── models/              # Modelos do banco de dados
│   ├── routers/             # Rotas da API
│   ├── database.py          # Configuração do banco
│   └── config.py            # Configurações
├── static/
│   ├── css/                 # Estilos CSS
│   ├── js/                  # JavaScript
│   └── uploads/             # Arquivos enviados
├── templates/               # Templates HTML
├── requirements.txt         # Dependências Python
└── README.md
```

## Instalação e Execução

### 1. Clone o repositório
```bash
git clone <repository-url>
cd Projeto_bot2
```

### 2. Instale as dependências
```bash
pip install -r requirements.txt
```

### 3. Execute a aplicação
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Acesse a aplicação
- **Computador**: http://localhost:8000
- **Celular**: http://[seu-ip]:8000

## Como Usar

1. **Selecione seu turno** (1º, 2º ou 3º)
2. **Informe seu nome**
3. **Cole o texto** do WhatsApp ou digite diretamente
4. **Anexe fotos** (opcional)
5. **Envie o relatório**
6. **Visualize** todos os relatórios na timeline

## Próximas Funcionalidades
- [ ] Sistema de autenticação
- [ ] Filtros por data e usuário
- [ ] Exportação de relatórios
- [ ] Notificações em tempo real
- [ ] Dashboard administrativo
- [ ] API para integração externa

## Contribuição
Este projeto está em desenvolvimento ativo. Sugestões e melhorias são bem-vindas!

## Licença
MIT License
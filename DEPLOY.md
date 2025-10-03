# 🚀 Deploy no Railway - Sistema de Relatórios por Turnos

## 📋 Pré-requisitos
- Conta no [Railway](https://railway.app)
- Repositório GitHub público ou privado

## 🔧 Configuração no Railway

### 1. Criar Novo Projeto
1. Acesse [Railway](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha o repositório `relatorio_turnos_bot2`

### 2. Configurar Variáveis de Ambiente (Opcional)
No painel do Railway, em "Variables":

```bash
# Para PostgreSQL (Railway fornece automaticamente)
DATABASE_URL=postgresql://usuario:senha@host:port/database

# Para configurações customizadas
DEBUG=false
RAILWAY_ENVIRONMENT=production
```

### 3. Deploy Automático
- O Railway detectará automaticamente o projeto Python
- Usará o `railway.json` para configurações
- Instalará dependências do `requirements.txt`
- Executará o `start.py`

## 📁 Arquivos de Deploy Criados

### Core Files
- `railway.json` - Configurações do Railway
- `Procfile` - Comando de inicialização (fallback)
- `runtime.txt` - Versão do Python
- `start.py` - Script de inicialização para produção
- `requirements.txt` - Dependências (atualizado com PostgreSQL)

### Docker (Alternativo)
- `Dockerfile` - Imagem Docker customizada
- `.dockerignore` - Arquivos excluídos do build

### Monitoramento
- `healthcheck.sh` - Script de verificação de saúde
- `/health` endpoint - Health check HTTP

## 🔄 Processo de Deploy

1. **Build**: Railway instala dependências
2. **Database**: Cria/migra tabelas automaticamente
3. **Start**: Executa `python start.py`
4. **Health Check**: Verifica `/health` endpoint
5. **Live**: Aplicação disponível na URL do Railway

## 🌐 Após o Deploy

### URLs Disponíveis
- **App**: `https://seu-projeto.railway.app`
- **Health**: `https://seu-projeto.railway.app/health`
- **API**: `https://seu-projeto.railway.app/api/turnos`

### Monitoramento
- Logs em tempo real no painel Railway
- Métricas de CPU/RAM
- Health checks automáticos

## 🗄️ Banco de Dados

### SQLite (Desenvolvimento)
- Arquivo local `reports.db`
- Dados temporários (reseta a cada deploy)

### PostgreSQL (Produção Recomendada)
1. No Railway: "New" → "Database" → "PostgreSQL"
2. Conecte ao projeto
3. A `DATABASE_URL` será configurada automaticamente

## 📱 Acesso Mobile
- URL será acessível globalmente
- Interface responsiva funciona em qualquer dispositivo
- Upload de fotos funcionará normalmente

## 🔧 Configurações Avançadas

### Domínio Customizado
1. No Railway: "Settings" → "Domains"
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### Escalabilidade
- Railway escala automaticamente
- Múltiplas instâncias se necessário
- Load balancing incluído

## 📊 Monitoramento
```bash
# Verificar saúde da aplicação
curl https://seu-projeto.railway.app/health

# Logs em tempo real
railway logs --follow
```

## 🆘 Troubleshooting

### Problemas Comuns
1. **Build falha**: Verifique `requirements.txt`
2. **App não inicia**: Verifique logs no Railway
3. **Database error**: Confirme `DATABASE_URL`
4. **404 errors**: Verifique paths estáticos

### Comandos Railway CLI
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Logs
railway logs

# Deploy manual
railway up
```

## ✅ Checklist de Deploy
- [ ] Repositório GitHub atualizado
- [ ] Projeto criado no Railway
- [ ] Build executado com sucesso
- [ ] Health check passando
- [ ] Aplicação acessível
- [ ] Upload de fotos funcionando
- [ ] Banco de dados conectado

---

🎉 **Parabéns!** Seu Sistema de Relatórios por Turnos está agora rodando em produção no Railway!
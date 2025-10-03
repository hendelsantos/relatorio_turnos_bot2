# 🧹 Sistema de Limpeza Automática - Relatórios por Turnos

## 📋 Visão Geral

O sistema implementa limpeza automática de relatórios para evitar sobrecarga, removendo automaticamente dados com mais de 24 horas.

## ⚙️ Funcionamento

### 🕐 **Regra Principal**
- **Tempo de vida**: 24 horas
- **Escopo**: Relatórios + fotos associadas
- **Frequência**: A cada 6 horas
- **Execução**: Automática na inicialização + periódica

### 🔄 **Processo de Limpeza**

1. **Identificação**: Localiza relatórios com `data_criacao < (agora - 24h)`
2. **Limpeza de Fotos**: Remove arquivos físicos do disco
3. **Limpeza do Banco**: Remove registros da base de dados
4. **Logs**: Registra quantidade de itens removidos

## 📊 **Endpoints de API**

### 1. Health Check
```bash
GET /health
```
**Resposta:**
```json
{
  "status": "healthy",
  "service": "Sistema de Relatórios por Turnos",
  "features": {
    "auto_cleanup": "Ativo - Remove relatórios > 24h",
    "cleanup_interval": "6 horas",
    "cleanup_scope": "Relatórios + fotos associadas"
  },
  "timestamp": "2025-10-03T19:55:09.325715"
}
```

### 2. Status da Limpeza
```bash
GET /api/cleanup/status
```
**Resposta:**
```json
{
  "status": "success",
  "total_relatórios": 15,
  "relatórios_antigos": 3,
  "relatórios_ativos": 12,
  "limite_24h": "2025-10-02T19:55:25.563400",
  "próxima_limpeza": "A cada 6 horas automaticamente",
  "timestamp": "2025-10-03T19:55:25.568086"
}
```

### 3. Limpeza Manual
```bash
GET /api/cleanup
```
**Resposta:**
```json
{
  "status": "success",
  "message": "Limpeza executada com sucesso",
  "resultado": {
    "deletados": 3,
    "fotos_removidas": 7
  },
  "timestamp": "2025-10-03T19:55:30.123456"
}
```

## 🔧 **Configuração**

### Parâmetros Customizáveis

| Parâmetro | Valor Atual | Localização | Descrição |
|-----------|-------------|-------------|-----------|
| **Tempo de vida** | 24 horas | `app/main.py:linha 42` | `timedelta(hours=24)` |
| **Intervalo** | 6 horas | `app/main.py:linha 94` | `threading.Event().wait(21600)` |
| **Auto-start** | Ativo | `app/main.py:linha 125` | `iniciar_limpeza_automatica()` |

### Personalização

```python
# Para alterar tempo de vida para 12 horas:
limite_12h = datetime.now() - timedelta(hours=12)

# Para alterar intervalo para 3 horas:
threading.Event().wait(10800)  # 3 horas = 10800 segundos
```

## 📈 **Monitoramento**

### Logs do Sistema
```
🚀 Iniciando sistema de limpeza automática (24h)
✅ Limpeza automática: Nenhum relatório antigo encontrado
✅ Limpeza inicial concluída
🔄 Próxima limpeza em 6 horas...
🧹 Limpeza automática: 3 relatórios e 7 fotos removidos
🗑️ Foto removida: static/uploads/foto_12345.jpg
```

### Métricas Disponíveis
- Total de relatórios no sistema
- Quantidade de relatórios antigos (> 24h)
- Relatórios ativos (< 24h)
- Timestamp da última verificação
- Arquivos de foto removidos

## 🛡️ **Segurança**

### Proteções Implementadas
- ✅ **Rollback automático** em caso de erro
- ✅ **Validação de caminhos** de arquivo
- ✅ **Try-catch** em todas operações
- ✅ **Logs detalhados** para auditoria
- ✅ **Thread daemon** (não bloqueia encerramento)

### Cenários de Erro
- **Arquivo não encontrado**: Log de aviso, continua processo
- **Erro JSON**: Skip do relatório, continua limpeza
- **Erro banco**: Rollback completo, preserva dados
- **Erro thread**: Restart automático na próxima inicialização

## 🚀 **Deploy e Produção**

### Railway/Heroku
- ✅ Configuração automática
- ✅ Logs visíveis no dashboard
- ✅ Health check compatível
- ✅ Zero configuração adicional

### Docker
```dockerfile
# Dockerfile já configurado com:
COPY app/ app/
# Sistema inicia automaticamente
```

### Variáveis de Ambiente (Futuro)
```bash
CLEANUP_INTERVAL_HOURS=6
CLEANUP_RETENTION_HOURS=24
CLEANUP_ENABLED=true
```

## 🔍 **Troubleshooting**

### Problemas Comuns

**1. Limpeza não executa**
```bash
# Verificar logs:
curl localhost:8000/health
curl localhost:8000/api/cleanup/status
```

**2. Muitos arquivos removidos**
```bash
# Verificar configuração:
grep "timedelta(hours=" app/main.py
```

**3. Erro de permissão**
```bash
# Verificar permissões do diretório:
ls -la static/uploads/
```

### Debug Mode
```python
# Adicionar no app/main.py para debug:
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📋 **Changelog**

- **v1.0** - Sistema básico de limpeza automática
- **v1.1** - Endpoints de monitoramento
- **v1.2** - Logs estruturados e health check
- **v1.3** - Thread safety e error handling

---

## 🎯 **Benefícios**

✅ **Performance**: Sistema sempre otimizado  
✅ **Storage**: Controle automático de espaço  
✅ **Manutenção**: Zero intervenção manual  
✅ **Escalabilidade**: Adequado para alto volume  
✅ **Compliance**: Retenção controlada de dados
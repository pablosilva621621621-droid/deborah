# 🌸 Deborah Birthday Party - Deploy Guide

## 📦 Arquivos de Configuração Criados

Todos os arquivos necessários para o deploy no Railway foram criados:

### Arquivos de Configuração Railway
- ✅ `railway.toml` - Configuração principal do Railway
- ✅ `nixpacks.toml` - Configuração do builder Nixpacks
- ✅ `Procfile` - Comando de inicialização
- ✅ `.railwayignore` - Arquivos ignorados no deploy

### Arquivos de Documentação
- ✅ `RAILWAY_DEPLOY.md` - Guia completo de deploy
- ✅ `DEPLOY_CHECKLIST.md` - Checklist passo a passo
- ✅ `QUICK_START.md` - Início rápido (3 passos)
- ✅ `.env.production.example` - Exemplo de variáveis de ambiente

### Arquivos Modificados
- ✅ `backend/package.json` - Adicionado `engines` para Node.js 18+
- ✅ `backend/src/config/postgres.js` - Suporte para DATABASE_URL e variáveis PG*
- ✅ `.gitignore` - Proteção de arquivos sensíveis

## 🚀 Como Fazer o Deploy

### Método 1: Quick Start (Recomendado)
```bash
# Leia o guia rápido
cat QUICK_START.md
```

### Método 2: Guia Completo
```bash
# Leia o guia detalhado
cat RAILWAY_DEPLOY.md
```

### Método 3: Checklist Interativo
```bash
# Siga o checklist
cat DEPLOY_CHECKLIST.md
```

## 📋 Resumo do Processo

1. **Banco de Dados**: Configure PostgreSQL no Supabase ou Railway
2. **Deploy**: Push para GitHub e conecte ao Railway
3. **Variáveis**: Configure as variáveis de ambiente no Railway
4. **Teste**: Acesse a URL gerada e teste a aplicação

## 🔧 Estrutura do Projeto

```
deborah/
├── railway.toml              # Config Railway
├── nixpacks.toml             # Config Nixpacks
├── Procfile                  # Start command
├── .railwayignore            # Ignore files
├── .gitignore                # Git ignore
├── RAILWAY_DEPLOY.md         # Guia completo
├── DEPLOY_CHECKLIST.md       # Checklist
├── QUICK_START.md            # Início rápido
├── .env.production.example   # Env vars exemplo
├── backend/
│   ├── package.json          # Com engines
│   ├── src/
│   │   ├── server.js         # Servidor principal
│   │   └── config/
│   │       └── postgres.js   # Config DB atualizada
│   └── ...
└── frontend/                 # Servido pelo backend
    └── ...
```

## ⚙️ Variáveis de Ambiente Necessárias

### Obrigatórias
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
ADMIN_PASSWORD=...
ALLOWED_ORIGINS=https://seu-app.up.railway.app
```

### Opcionais (alternativa ao DATABASE_URL)
```env
PGHOST=...
PGPORT=5432
PGUSER=postgres
PGPASSWORD=...
PGDATABASE=postgres
```

## 🎯 Endpoints da Aplicação

Após o deploy, sua aplicação terá:

- **Frontend**:
  - `/` - Formulário RSVP
  - `/login` - Login admin
  - `/dashboard` - Dashboard admin

- **API**:
  - `/api` - Status da API
  - `/api/auth/*` - Autenticação
  - `/api/guests/*` - Gerenciamento de convidados

## 🔍 Verificação Pós-Deploy

Execute estes testes após o deploy:

```bash
# Status da API
curl https://seu-app.up.railway.app/api

# Health check
curl https://seu-app.up.railway.app/

# Teste de CORS
curl -H "Origin: https://seu-app.up.railway.app" \
     https://seu-app.up.railway.app/api
```

## 📊 Monitoramento

- **Logs**: Railway Dashboard → Deployments → View Logs
- **Métricas**: Railway Dashboard → Metrics
- **Alertas**: Railway Dashboard → Settings → Notifications

## 🐛 Troubleshooting

### Deploy falhou?
1. Verifique os logs no Railway
2. Confirme que todas as variáveis estão configuradas
3. Teste a conexão com o banco de dados

### Aplicação não responde?
1. Verifique se o PORT está correto
2. Confirme que o DATABASE_URL está válido
3. Veja os logs de startup

### Erro de CORS?
1. Atualize ALLOWED_ORIGINS com a URL real do Railway
2. Reinicie a aplicação

## 💡 Dicas

1. **Use PostgreSQL do Railway**: Mais fácil que Supabase
   - Railway → New → Database → PostgreSQL
   - DATABASE_URL configurado automaticamente

2. **Monitore os custos**: Railway tem $5/mês grátis

3. **Configure domínio customizado**: Settings → Domains

4. **Ative notificações**: Para erros e downtime

## 🎉 Pronto para Deploy!

Tudo está configurado e pronto. Escolha um dos métodos acima e faça o deploy!

**Dúvidas?** Consulte os arquivos de documentação criados.

---

**Criado por**: Kiro AI  
**Data**: $(date)  
**Versão**: 1.0.0

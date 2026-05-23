# 🚂 Deploy no Railway - Guia Completo

## 📋 Pré-requisitos

1. Conta no Railway (https://railway.app)
2. Conta no Supabase (https://supabase.com) - para PostgreSQL
3. Código no GitHub (recomendado)

## 🚀 Passo a Passo para Deploy

### 1. Preparar o Banco de Dados (Supabase)

1. Acesse https://supabase.com e crie um novo projeto
2. Vá em **Settings** → **Database**
3. Copie a **Connection String** (formato URI)
4. Guarde essa string, você vai precisar dela no Railway

### 2. Deploy no Railway

#### Opção A: Deploy via GitHub (Recomendado)

1. Faça push do código para o GitHub:
   ```bash
   git add .
   git commit -m "Configuração para deploy no Railway"
   git push origin main
   ```

2. Acesse https://railway.app
3. Clique em **New Project**
4. Selecione **Deploy from GitHub repo**
5. Escolha o repositório `deborah`
6. Railway vai detectar automaticamente o projeto Node.js

#### Opção B: Deploy via Railway CLI

1. Instale o Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Faça login:
   ```bash
   railway login
   ```

3. Inicialize o projeto:
   ```bash
   railway init
   ```

4. Faça o deploy:
   ```bash
   railway up
   ```

### 3. Configurar Variáveis de Ambiente

No painel do Railway, vá em **Variables** e adicione:

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=production

# Banco de Dados PostgreSQL (Supabase)
DATABASE_URL=postgresql://user:password@host:5432/database
PGHOST=seu-projeto.supabase.co
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua-senha-supabase
PGDATABASE=postgres

# Segurança (GERE VALORES SEGUROS!)
JWT_SECRET=gere-uma-chave-secreta-forte-aqui-use-openssl-rand-base64-32
ADMIN_PASSWORD=sua-senha-admin-segura

# CORS (substitua pelo domínio do Railway)
ALLOWED_ORIGINS=https://seu-app.up.railway.app
```

**⚠️ IMPORTANTE:** 
- Substitua `DATABASE_URL` pela connection string do Supabase
- Gere um `JWT_SECRET` forte: `openssl rand -base64 32`
- Use uma senha forte para `ADMIN_PASSWORD`
- Atualize `ALLOWED_ORIGINS` com o domínio do Railway após o deploy

### 4. Verificar o Deploy

1. Railway vai gerar uma URL automaticamente: `https://seu-app.up.railway.app`
2. Acesse a URL para verificar se está funcionando
3. Teste os endpoints:
   - `https://seu-app.up.railway.app/` - Formulário RSVP
   - `https://seu-app.up.railway.app/login` - Login admin
   - `https://seu-app.up.railway.app/dashboard` - Dashboard
   - `https://seu-app.up.railway.app/api` - API status

### 5. Configurar Domínio Customizado (Opcional)

1. No Railway, vá em **Settings** → **Domains**
2. Clique em **Add Domain**
3. Adicione seu domínio customizado
4. Configure os DNS records conforme instruções do Railway
5. Atualize `ALLOWED_ORIGINS` com o novo domínio

## 🔧 Estrutura de Arquivos para Deploy

```
deborah/
├── railway.json          # Configuração do Railway
├── nixpacks.toml         # Configuração do Nixpacks (builder)
├── Procfile              # Comando de start
├── .railwayignore        # Arquivos ignorados no deploy
├── backend/
│   ├── package.json      # Com engines especificadas
│   ├── src/
│   │   └── server.js     # Servidor principal
│   └── ...
└── frontend/             # Servido pelo backend
    └── ...
```

## 📊 Monitoramento

- **Logs**: Acesse a aba **Deployments** no Railway para ver logs em tempo real
- **Métricas**: Veja uso de CPU, memória e rede na aba **Metrics**
- **Health Check**: Railway faz health checks automáticos na porta especificada

## 🐛 Troubleshooting

### Erro: "Cannot find module"
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para testar

### Erro: "Database connection failed"
- Verifique se as variáveis `DATABASE_URL` ou `PG*` estão corretas
- Teste a conexão com o Supabase localmente primeiro

### Erro: "Port already in use"
- Railway define a variável `PORT` automaticamente
- Seu código já está configurado para usar `process.env.PORT`

### Frontend não carrega
- Verifique se o caminho `../../frontend` está correto
- Confirme que a pasta `frontend` está no repositório

## 🔄 Atualizações

Para fazer deploy de novas versões:

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

Railway vai fazer o deploy automático a cada push!

## 💡 Dicas

1. **Use PostgreSQL do Railway**: Você pode usar o PostgreSQL do Railway em vez do Supabase
   - No Railway, clique em **New** → **Database** → **PostgreSQL**
   - Railway vai configurar `DATABASE_URL` automaticamente

2. **Monitore os custos**: Railway tem plano gratuito com limites
   - $5/mês de crédito grátis
   - Depois disso, paga pelo uso

3. **Configure alertas**: Configure notificações para erros e downtime

4. **Backup do banco**: Configure backups automáticos no Supabase

## 🎉 Pronto!

Sua aplicação está no ar! 🚀

Acesse: `https://seu-app.up.railway.app`

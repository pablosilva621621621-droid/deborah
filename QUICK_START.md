# 🚀 Quick Start - Deploy no Railway

## 3 Passos Rápidos

### 1️⃣ Configure o Banco de Dados (Supabase)

```bash
# Acesse: https://supabase.com
# Crie um projeto
# Copie a Connection String em Settings → Database
```

### 2️⃣ Faça o Deploy

**Opção A: Via GitHub (Recomendado)**

```bash
# Commit e push
git add .
git commit -m "Configuração para Railway"
git push origin main

# Acesse: https://railway.app
# New Project → Deploy from GitHub → Escolha o repo
```

**Opção B: Via Railway CLI**

```bash
# Instale o CLI
npm i -g @railway/cli

# Login e deploy
railway login
railway init
railway up
```

### 3️⃣ Configure Variáveis de Ambiente

No Railway, vá em **Variables** e adicione:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host.supabase.co:5432/postgres
JWT_SECRET=gere-com-openssl-rand-base64-32
ADMIN_PASSWORD=sua-senha-segura
ALLOWED_ORIGINS=https://seu-app.up.railway.app
```

## ✅ Pronto!

Acesse: `https://seu-app.up.railway.app`

---

📚 **Documentação Completa**: Veja `RAILWAY_DEPLOY.md`  
✅ **Checklist**: Veja `DEPLOY_CHECKLIST.md`

# 🌸 Deborah Birthday Party - Sistema de RSVP

Sistema completo de confirmação de presença para festa de aniversário, com backend Node.js/Express e frontend HTML/CSS/JS.

## 🚀 Deploy no Railway

### ⚠️ IMPORTANTE: Problema IPv6 Resolvido

O código foi corrigido para evitar problemas de conexão IPv6 com PostgreSQL.

### 📋 Passo a Passo Rápido

#### 1. Commit e Push
```bash
git add .
git commit -m "fix: Configuração completa para Railway com correção IPv6"
git push origin main
```

#### 2. Configurar Banco de Dados

**Opção A: PostgreSQL do Railway (RECOMENDADO)**
1. No Railway: **New** → **Database** → **PostgreSQL**
2. Conecte ao seu serviço
3. `DATABASE_URL` configurado automaticamente
4. ✅ Pronto!

**Opção B: Supabase (Use o Pooler)**
1. Supabase → Settings → Database → Connection String
2. Selecione **Transaction Mode** e **URI**
3. Copie a string com `.pooler.supabase.com`
4. Configure no Railway como `DATABASE_URL`

#### 3. Configurar Variáveis de Ambiente

No Railway, vá em **Variables** e adicione:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...  # Configurado automaticamente se usar Railway DB
JWT_SECRET=gere-com-openssl-rand-base64-32
ADMIN_PASSWORD=sua-senha-admin-segura
ALLOWED_ORIGINS=https://seu-app.up.railway.app
```

#### 4. Verificar Deploy

Acesse os logs no Railway e confirme:
```
✅ Conexão com banco de dados estabelecida
✅ Servidor pronto para receber requisições!
```

---

## 📚 Documentação Completa

- **[CORRIGIR_AGORA.md](CORRIGIR_AGORA.md)** - Correção específica para seu caso
- **[SOLUCAO_DEFINITIVA.md](SOLUCAO_DEFINITIVA.md)** - Solução completa do problema IPv6
- **[QUICK_START.md](QUICK_START.md)** - Início rápido em 3 passos
- **[RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)** - Guia completo de deploy
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Configuração do banco de dados
- **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** - Checklist interativo

---

## 🛠️ Tecnologias

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: HTML, CSS, JavaScript
- **Deploy**: Railway
- **Banco de Dados**: PostgreSQL (Railway ou Supabase)

---

## 🎯 Funcionalidades

- ✅ Formulário de confirmação de presença (RSVP)
- ✅ Dashboard administrativo
- ✅ Autenticação JWT
- ✅ Gerenciamento de convidados
- ✅ Estatísticas em tempo real
- ✅ Design responsivo

---

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
cd backend
npm install

# Configurar .env
cp .env.example .env
# Edite .env com suas configurações

# Iniciar servidor
npm run dev
```

Acesse:
- Formulário: http://localhost:3000/
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard

---

## 📝 Estrutura do Projeto

```
deborah/
├── backend/
│   ├── src/
│   │   ├── config/       # Configurações (DB, env)
│   │   ├── controllers/  # Lógica de negócio
│   │   ├── middleware/   # Autenticação, validação
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Serviços de dados
│   │   └── server.js     # Servidor principal
│   └── package.json
├── frontend/
│   ├── auth/            # Página de login
│   ├── dashboard/       # Dashboard admin
│   ├── lista/           # Formulário RSVP
│   └── imagens/         # Assets
└── [Arquivos de deploy e documentação]
```

---

## 🎉 Status

✅ **Pronto para deploy no Railway!**

Todas as configurações foram aplicadas e o código está otimizado para produção.

---

## 📞 Suporte

Se tiver problemas:
1. Leia **[CORRIGIR_AGORA.md](CORRIGIR_AGORA.md)** para correções específicas
2. Consulte **[SOLUCAO_DEFINITIVA.md](SOLUCAO_DEFINITIVA.md)** para troubleshooting
3. Verifique os logs no Railway

---

**Desenvolvido por**: Pablo Silva  
**Deploy**: Railway.app  
**Banco de Dados**: PostgreSQL

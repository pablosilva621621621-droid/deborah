# ✅ Checklist de Deploy - Railway

## Antes do Deploy

- [ ] Código commitado no Git
- [ ] Conta no Railway criada (https://railway.app)
- [ ] Banco de dados PostgreSQL configurado (Supabase ou Railway)

## Configuração do Railway

### 1. Criar Projeto
- [ ] Acessar https://railway.app
- [ ] Clicar em "New Project"
- [ ] Selecionar "Deploy from GitHub repo"
- [ ] Escolher o repositório

### 2. Configurar Variáveis de Ambiente

Vá em **Variables** e adicione:

#### Obrigatórias:
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000` (Railway define automaticamente, mas pode especificar)
- [ ] `DATABASE_URL=postgresql://...` (connection string do Supabase)
- [ ] `JWT_SECRET=...` (gere com: `openssl rand -base64 32`)
- [ ] `ADMIN_PASSWORD=...` (senha forte para admin)

#### Opcionais (se não usar DATABASE_URL):
- [ ] `PGHOST=...`
- [ ] `PGPORT=5432`
- [ ] `PGUSER=postgres`
- [ ] `PGPASSWORD=...`
- [ ] `PGDATABASE=postgres`

#### CORS:
- [ ] `ALLOWED_ORIGINS=https://seu-app.up.railway.app`
  - ⚠️ Atualize após o deploy com a URL real

### 3. Verificar Deploy

- [ ] Deploy completou sem erros
- [ ] Logs mostram "Servidor rodando"
- [ ] Acesse a URL gerada pelo Railway

### 4. Testar Aplicação

- [ ] `https://seu-app.up.railway.app/` - Página inicial carrega
- [ ] `https://seu-app.up.railway.app/api` - API responde
- [ ] `https://seu-app.up.railway.app/login` - Página de login carrega
- [ ] `https://seu-app.up.railway.app/dashboard` - Dashboard carrega (após login)
- [ ] Testar cadastro de convidado
- [ ] Testar login admin
- [ ] Testar visualização de convidados no dashboard

### 5. Configurações Finais

- [ ] Atualizar `ALLOWED_ORIGINS` com a URL real do Railway
- [ ] Configurar domínio customizado (opcional)
- [ ] Configurar alertas de erro
- [ ] Documentar URL de produção

## Banco de Dados (Supabase)

- [ ] Projeto criado no Supabase
- [ ] Connection string copiada
- [ ] Tabelas criadas automaticamente no primeiro acesso
- [ ] Backup configurado (recomendado)

## Alternativa: PostgreSQL do Railway

Se preferir usar o banco do Railway em vez do Supabase:

- [ ] No Railway, clicar em "New" → "Database" → "PostgreSQL"
- [ ] Railway vai criar `DATABASE_URL` automaticamente
- [ ] Não precisa configurar Supabase

## Monitoramento

- [ ] Verificar logs em tempo real
- [ ] Monitorar métricas (CPU, memória)
- [ ] Configurar notificações de erro

## Troubleshooting

### Se o deploy falhar:

1. **Verificar logs**: Aba "Deployments" → Ver logs
2. **Variáveis de ambiente**: Confirmar que todas estão configuradas
3. **Banco de dados**: Testar conexão com Supabase
4. **Build**: Verificar se `npm install` completou

### Se a aplicação não responder:

1. **Health check**: Railway verifica se a porta está respondendo
2. **Logs**: Procurar por erros no startup
3. **Variáveis**: Confirmar `PORT` e `DATABASE_URL`

## Comandos Úteis

```bash
# Ver logs em tempo real (Railway CLI)
railway logs

# Fazer redeploy
git push origin main

# Conectar ao banco (Railway CLI)
railway connect

# Abrir aplicação no browser
railway open
```

## 🎉 Deploy Completo!

Sua aplicação está no ar em: `https://seu-app.up.railway.app`

## Próximos Passos

- [ ] Compartilhar URL com usuários
- [ ] Monitorar uso e performance
- [ ] Configurar domínio customizado
- [ ] Configurar CI/CD (já automático com GitHub)
- [ ] Documentar processo de atualização

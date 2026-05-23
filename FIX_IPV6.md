# 🔧 Correção Final - IPv6 Issue

## Problema

O erro `ENETUNREACH 2600:1f14:...` indica que o PostgreSQL está resolvendo o hostname para IPv6, mas o Railway não consegue conectar via IPv6.

## Solução Aplicada

Mudei a configuração para **parsear manualmente** o DATABASE_URL e usar configuração explícita (host, port, user, password, database) em vez de `connectionString`. Isso força o Node.js a resolver o DNS corretamente.

## ⚠️ IMPORTANTE: Verifique seu DATABASE_URL

O problema pode estar no **DATABASE_URL do Supabase**. Alguns hosts do Supabase só respondem em IPv6.

### Solução Definitiva: Use PostgreSQL do Railway

1. No Railway, clique em **New** → **Database** → **PostgreSQL**
2. Conecte o banco ao seu serviço
3. Railway vai gerar um `DATABASE_URL` que **funciona 100%**
4. Não precisa configurar nada manualmente

### Se Quiser Continuar com Supabase

Tente usar o **Connection Pooler** do Supabase em vez da conexão direta:

1. No Supabase, vá em **Settings** → **Database**
2. Em **Connection String**, selecione **Transaction Mode** (não Session Mode)
3. Use a string que termina com `.pooler.supabase.com`

**Exemplo:**
```
postgresql://postgres.abc:senha@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

O pooler geralmente tem melhor suporte para IPv4.

## Commit e Teste

```bash
git add .
git commit -m "fix: Parse manual do DATABASE_URL para evitar IPv6"
git push origin main
```

Após o push, o Railway vai fazer redeploy automaticamente.

## Se Ainda Não Funcionar

**Use PostgreSQL do Railway** - é a solução mais confiável e simples!

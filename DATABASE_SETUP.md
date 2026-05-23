# 🗄️ Configuração do Banco de Dados

## ⚠️ IMPORTANTE: Problema IPv6 Resolvido

A aplicação agora está configurada para usar **APENAS DATABASE_URL** e força IPv4 para evitar erros de conexão.

## 🎯 Solução Recomendada: PostgreSQL do Railway

A forma mais fácil e que **garante funcionamento** é usar o PostgreSQL do próprio Railway:

### Passo a Passo:

1. **No painel do Railway**, clique em **New**
2. Selecione **Database** → **PostgreSQL**
3. Railway vai criar o banco automaticamente
4. A variável `DATABASE_URL` será configurada automaticamente
5. **Conecte o banco ao seu serviço**:
   - Clique no serviço da aplicação
   - Vá em **Variables**
   - Você verá `DATABASE_URL` já configurado

✅ **Pronto!** Não precisa configurar mais nada.

---

## 🔄 Alternativa: Supabase

Se preferir usar Supabase:

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Aguarde a criação (leva ~2 minutos)

### 2. Obter Connection String

1. Vá em **Settings** → **Database**
2. Role até **Connection String**
3. Selecione **URI** (não "Session mode")
4. Copie a string que começa com `postgresql://`

**Exemplo:**
```
postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### 3. Substituir a Senha

Na string copiada, substitua `[YOUR-PASSWORD]` pela senha que você definiu ao criar o projeto.

**String final:**
```
postgresql://postgres.abcdefgh:sua_senha_aqui@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### 4. Configurar no Railway

1. No Railway, vá em **Variables**
2. Adicione a variável:
   - **Nome**: `DATABASE_URL`
   - **Valor**: Cole a connection string completa

### 5. Verificar Formato

✅ **Correto:**
```
postgresql://postgres.abc:senha@host.supabase.com:5432/postgres
```

❌ **Errado:**
```
postgres://...  (falta o "ql")
```

---

## 🔍 Verificação

Após configurar, o Railway vai fazer redeploy automaticamente. Verifique os logs:

### ✅ Sucesso:
```
🚀 Iniciando servidor...
📦 Ambiente: production
🔌 Porta: 3000
🔗 DATABASE_URL configurado
🔄 Testando conexão com banco de dados...
✅ Conexão com banco de dados estabelecida
📊 Inicializando tabelas...
```

### ❌ Erro:
```
❌ ERRO: DATABASE_URL não está configurado!
```
**Solução**: Configure a variável DATABASE_URL no Railway

```
❌ Falha na conexão com banco de dados
```
**Solução**: Verifique se a connection string está correta

---

## 🐛 Troubleshooting

### Erro: "DATABASE_URL não está configurado"
- Vá em Railway → Variables
- Adicione `DATABASE_URL` com a connection string

### Erro: "ENETUNREACH" ou "connect timeout"
- **Use PostgreSQL do Railway** (recomendado)
- Se usar Supabase, verifique se a connection string está correta
- Confirme que o formato é `postgresql://` (não `postgres://`)

### Erro: "password authentication failed"
- Verifique se a senha na connection string está correta
- No Supabase, a senha é a que você definiu ao criar o projeto

### Erro: "database does not exist"
- No Supabase, use `postgres` como nome do banco
- No Railway, use o nome gerado automaticamente

---

## 📝 Formato do DATABASE_URL

### Estrutura:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

### Exemplos Reais:

**Supabase:**
```
postgresql://postgres.abcdefgh:minha_senha_123@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**Railway:**
```
postgresql://postgres:senha_gerada@containers-us-west-123.railway.app:5432/railway
```

---

## ✅ Checklist Final

- [ ] DATABASE_URL configurado no Railway
- [ ] String começa com `postgresql://` (não `postgres://`)
- [ ] Senha substituída corretamente (sem `[YOUR-PASSWORD]`)
- [ ] Redeploy feito automaticamente
- [ ] Logs mostram "Conexão estabelecida"

---

## 💡 Recomendação Final

**Use PostgreSQL do Railway** - é mais simples, mais rápido e garante compatibilidade total!

1. Railway → New → Database → PostgreSQL
2. Conecte ao seu serviço
3. Pronto! ✅

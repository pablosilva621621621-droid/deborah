#!/bin/bash

# ══════════════════════════════════════════════════════════
# SCRIPT DE DEPLOY AUTOMATIZADO - RAILWAY
# ══════════════════════════════════════════════════════════

echo "🚂 Iniciando deploy para Railway..."
echo ""

# Verifica se há mudanças não commitadas
if [[ -n $(git status -s) ]]; then
  echo "📝 Commitando mudanças..."
  git add .
  git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
else
  echo "✅ Nenhuma mudança para commitar"
fi

# Push para o repositório
echo ""
echo "📤 Enviando para GitHub..."
git push origin main

echo ""
echo "✅ Deploy iniciado!"
echo ""
echo "🔍 Próximos passos:"
echo "   1. Acesse https://railway.app"
echo "   2. Verifique o status do deploy"
echo "   3. Configure as variáveis de ambiente (se ainda não fez)"
echo "   4. Teste a aplicação na URL gerada"
echo ""
echo "📚 Consulte RAILWAY_DEPLOY.md para instruções completas"
echo ""

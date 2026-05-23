/**
 * ══════════════════════════════════════════════════════════
 * SETUP SCRIPT
 * ══════════════════════════════════════════════════════════
 * Script para configuração inicial do projeto
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌸 ════════════════════════════════════════════════');
console.log('   Deborah Birthday Party - Setup');
console.log('════════════════════════════════════════════════ 🌸\n');

// Verifica se o .env existe
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado com sucesso!');
    console.log('⚠️  Lembre-se de configurar as variáveis de ambiente!\n');
  } else {
    console.log('❌ Arquivo .env.example não encontrado!\n');
  }
} else {
  console.log('✅ Arquivo .env já existe!\n');
}

// Verifica dependências
console.log('📦 Verificando dependências...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  
  console.log(`✅ ${dependencies.length} dependências encontradas`);
  console.log('   Execute "npm install" para instalar\n');
} else {
  console.log('❌ package.json não encontrado!\n');
}

// Instruções finais
console.log('🚀 Próximos passos:');
console.log('   1. Execute: npm install');
console.log('   2. Configure o arquivo .env');
console.log('   3. Execute: npm run dev');
console.log('   4. Acesse: http://localhost:3000\n');

console.log('📚 Documentação:');
console.log('   - README.md - Documentação completa');
console.log('   - QUICK_START.md - Guia rápido');
console.log('   - ARCHITECTURE.md - Arquitetura');
console.log('   - DEPLOY.md - Guia de deploy\n');

console.log('🌸 Setup concluído! Boa sorte! 🌸\n');

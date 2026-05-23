/**
 * ══════════════════════════════════════════════════════════
 * DEBORAH BIRTHDAY PARTY - LOGIN SCRIPT
 * ══════════════════════════════════════════════════════════
 */

// Configuração da API (mesmo servidor)
const API_URL = '/api';

// ── Elementos do DOM ──
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');

// ── Função para mostrar erro ──
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  
  // Remove a classe após a animação
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 4000);
}

// ── Função para validar senha com backend ──
async function validatePassword(password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Erro ao fazer login'
      };
    }

    return {
      success: true,
      token: data.data.token,
      expiresAt: data.data.expiresAt
    };
  } catch (error) {
    console.error('Erro ao conectar com o servidor:', error);
    return {
      success: false,
      message: 'Erro ao conectar com o servidor. Verifique se o backend está rodando.'
    };
  }
}

// ── Handler do formulário ──
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const password = passwordInput.value.trim();
  
  // Validação básica
  if (!password) {
    showError('Por favor, digite a senha.');
    passwordInput.focus();
    return;
  }
  
  // Desabilita o botão durante o processamento
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  
  try {
    // Valida a senha com o backend
    const result = await validatePassword(password);
    
    if (result.success) {
      // Sucesso - salva o token e redireciona
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('tokenExpiresAt', result.expiresAt);
      localStorage.setItem('authenticated', 'true');
      
      // Redireciona para o dashboard
      window.location.href = '/dashboard';
    } else {
      // Erro - mostra mensagem
      showError(result.message);
      passwordInput.value = '';
      passwordInput.focus();
    }
  } catch (error) {
    console.error('Erro no login:', error);
    showError('Erro inesperado. Tente novamente.');
  } finally {
    // Reabilita o botão
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
});

// ── Limpa mensagem de erro ao digitar ──
passwordInput.addEventListener('input', () => {
  if (errorMessage.classList.contains('show')) {
    errorMessage.classList.remove('show');
  }
});

// ── Foco automático no campo de senha ──
window.addEventListener('load', () => {
  passwordInput.focus();
  
  // Verifica se já está autenticado
  const token = localStorage.getItem('authToken');
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  
  if (token && expiresAt) {
    const now = new Date();
    const expires = new Date(expiresAt);
    
    // Se o token ainda é válido, redireciona
    if (now < expires) {
      window.location.href = '/dashboard';
    } else {
      // Token expirado, limpa
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiresAt');
      localStorage.removeItem('authenticated');
    }
  }
});

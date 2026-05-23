/**
 * ══════════════════════════════════════════════════════════
 * DEBORAH BIRTHDAY PARTY - DASHBOARD SCRIPT (SECURE)
 * ══════════════════════════════════════════════════════════
 */

// Configuração da API (mesmo servidor)
const API_URL = '/api';

// ── PROTEÇÃO DE AUTENTICAÇÃO ──────────────────────────────
function checkAuthentication() {
  const token = localStorage.getItem('authToken');
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  
  if (!token || !expiresAt) {
    // Não autenticado - redireciona para login
    window.location.href = '/login';
    return null;
  }
  
  const now = new Date();
  const expires = new Date(expiresAt);
  
  if (now >= expires) {
    // Token expirado - limpa e redireciona
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('authenticated');
    alert('Sua sessão expirou. Faça login novamente.');
    window.location.href = '/login';
    return null;
  }
  
  return token;
}

// Verifica autenticação ao carregar a página
const authToken = checkAuthentication();
if (!authToken) {
  // Se não autenticado, o código acima já redirecionou
  throw new Error('Não autenticado');
}

// ── FUNÇÕES DA API ────────────────────────────────────────

/**
 * Busca todos os convidados da API
 */
async function fetchGuests() {
  try {
    const response = await fetch(`${API_URL}/guests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401 || response.status === 403) {
      // Token inválido - redireciona para login
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiresAt');
      localStorage.removeItem('authenticated');
      alert('Sessão inválida. Faça login novamente.');
      window.location.href = '/login';
      return null;
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar convidados');
    }

    const data = await response.json();
    return data.data.guests;
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    throw error;
  }
}

/**
 * Busca estatísticas da API
 */
async function fetchStats() {
  try {
    const response = await fetch(`${API_URL}/guests/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
}

// ── FUNÇÕES DE RENDERIZAÇÃO ───────────────────────────────

/**
 * Gera iniciais a partir de um nome
 */
function initials(name) {
  return name.trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}

/**
 * Renderiza uma lista de convidados
 */
function renderList(containerId, guests, isGoing) {
  const el = document.getElementById(containerId);
  
  if (!guests.length) {
    el.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon" aria-hidden="true">${isGoing ? '🌸' : '🥺'}</span>
        <p class="empty-text">${isGoing ? 'Nenhuma confirmação ainda' : 'Nenhuma recusa ainda'}</p>
      </div>`;
    return;
  }
  
  el.innerHTML = guests.map((guest, i) => {
    // Cada convidado pode ter múltiplos nomes
    const names = guest.names || [];
    return names.map((name, j) => `
      <div class="guest-item" style="animation-delay:${(i + j) * 0.04}s" role="listitem">
        <div class="avatar ${isGoing ? '' : 'not'}" aria-hidden="true">${initials(name)}</div>
        <span class="guest-name">${name}</span>
      </div>
    `).join('');
  }).join('');
}

/**
 * Anima contagem de números
 */
function animateCount(el, target) {
  const duration = 600;
  const start = performance.now();
  const from = parseInt(el.textContent) || 0;
  
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(from + (target - from) * ease);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}

/**
 * Atualiza o timestamp de última atualização
 */
function updateTimestamp() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('lastUpdate').textContent =
    `Última atualização: ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// ── CARREGAMENTO DO DASHBOARD ─────────────────────────────

/**
 * Carrega e atualiza o dashboard com dados da API
 */
async function loadDashboard() {
  const btn = document.getElementById('refreshBtn');
  btn.classList.add('spinning');
  btn.disabled = true;

  try {
    // Busca dados da API
    const [guests, stats] = await Promise.all([
      fetchGuests(),
      fetchStats()
    ]);

    if (!guests || !stats) {
      throw new Error('Dados não recebidos');
    }

    // Separa convidados por status
    const going = guests.filter(g => g.attendance === 'going');
    const notGoing = guests.filter(g => g.attendance === 'not-going');

    // Atualiza métricas com animação (contagem de PESSOAS, não formulários)
    animateCount(document.getElementById('countGoing'), stats.goingPeople);
    animateCount(document.getElementById('countNotGoing'), stats.notGoingPeople);
    animateCount(document.getElementById('countTotal'), stats.totalPeople);

    // Atualiza badges (número de pessoas em cada lista)
    document.getElementById('badgeGoing').textContent = stats.goingPeople;
    document.getElementById('badgeNotGoing').textContent = stats.notGoingPeople;

    // Atualiza barra de progresso (baseada em pessoas)
    const percentage = stats.totalPeople > 0 
      ? Math.round((stats.goingPeople / stats.totalPeople) * 100) 
      : 0;
    
    setTimeout(() => {
      document.getElementById('progressBar').style.width = percentage + '%';
    }, 100);
    
    document.getElementById('progressCaption').textContent =
      stats.totalPeople > 0
        ? `${percentage}% das pessoas confirmaram presença · ${stats.totalPeople} pessoa${stats.totalPeople !== 1 ? 's' : ''} no total`
        : 'Nenhuma resposta ainda';

    // Renderiza listas
    renderList('listGoing', going, true);
    renderList('listNotGoing', notGoing, false);

    // Atualiza timestamp
    updateTimestamp();
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    alert('Erro ao carregar dados. Verifique se o backend está rodando.');
  } finally {
    setTimeout(() => {
      btn.classList.remove('spinning');
      btn.disabled = false;
    }, 500);
  }
}

// ── EVENT LISTENERS ───────────────────────────────────────

// Botão atualizar
document.getElementById('refreshBtn').addEventListener('click', loadDashboard);

// ── INICIALIZAÇÃO ─────────────────────────────────────────

// Carrega dados ao iniciar
loadDashboard();

// Atualiza automaticamente a cada 30 segundos
setInterval(loadDashboard, 30000);

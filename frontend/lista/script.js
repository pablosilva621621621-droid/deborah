/**
 * ══════════════════════════════════════════════════════════
 * DEBORAH BIRTHDAY PARTY - RSVP FORM SCRIPT
 * ══════════════════════════════════════════════════════════
 */

// ── Elementos do DOM ──────────────────────────────────────
const guestsList = document.getElementById('guestsList');
const addBtn = document.getElementById('addGuestBtn');
const confirmBtn = document.getElementById('confirmBtn');
const formBody = document.getElementById('form-body');
const successState = document.getElementById('successState');

// ── Configurações ─────────────────────────────────────────
const MAX_GUESTS = 8;
let guestCount = 0;

/**
 * Cria uma nova linha de convidado
 * @param {number} index - Número do convidado
 * @returns {HTMLElement} Elemento da linha do convidado
 */
function createGuestRow(index) {
  const row = document.createElement('div');
  row.className = 'guest-row';
  row.setAttribute('role', 'listitem');
  row.dataset.index = index;

  row.innerHTML = `
    <div class="guest-number" aria-hidden="true">${index}</div>
    <input
      class="guest-input"
      type="text"
      placeholder="Nome completo"
      maxlength="80"
      autocomplete="off"
      aria-label="Nome do convidado ${index}"
      data-guest-index="${index}"
    />
    <button
      class="remove-btn ${index === 1 ? 'hidden' : ''}"
      type="button"
      aria-label="Remover convidado ${index}"
      data-remove="${index}"
    >×</button>
  `;

  // Adiciona event listeners
  row.querySelector('.guest-input').addEventListener('input', onInputChange);
  row.querySelector('.remove-btn').addEventListener('click', () => removeGuest(row));

  return row;
}

/**
 * Adiciona um novo convidado à lista
 */
function addGuest() {
  if (guestCount >= MAX_GUESTS) return;
  
  guestCount++;
  const row = createGuestRow(guestCount);
  guestsList.appendChild(row);
  row.querySelector('.guest-input').focus();
  
  updateAddBtn();
  updateConfirmBtn();
  reindexRows();
}

/**
 * Remove um convidado da lista
 * @param {HTMLElement} row - Elemento da linha a ser removida
 */
function removeGuest(row) {
  row.style.transition = 'opacity .25s, transform .25s';
  row.style.opacity = '0';
  row.style.transform = 'translateX(12px)';
  
  setTimeout(() => {
    row.remove();
    guestCount--;
    updateAddBtn();
    updateConfirmBtn();
    reindexRows();
  }, 250);
}

/**
 * Reindexa as linhas de convidados após adição/remoção
 */
function reindexRows() {
  const rows = guestsList.querySelectorAll('.guest-row');
  
  rows.forEach((r, i) => {
    const num = i + 1;
    const numEl = r.querySelector('.guest-number');
    const input = r.querySelector('.guest-input');
    const remEl = r.querySelector('.remove-btn');
    
    numEl.textContent = num;
    input.setAttribute('aria-label', `Nome do convidado ${num}`);
    remEl.setAttribute('aria-label', `Remover convidado ${num}`);
    
    if (num === 1) {
      remEl.classList.add('hidden');
    } else {
      remEl.classList.remove('hidden');
    }
  });
}

/**
 * Atualiza o estado do botão "Adicionar outra pessoa"
 */
function updateAddBtn() {
  addBtn.disabled = guestCount >= MAX_GUESTS;
  addBtn.style.opacity = guestCount >= MAX_GUESTS ? '.4' : '1';
  addBtn.style.cursor = guestCount >= MAX_GUESTS ? 'not-allowed' : 'pointer';
}

/**
 * Obtém a opção de presença selecionada
 * @returns {string|null} 'yes', 'no' ou null
 */
function getAttendance() {
  const sel = document.querySelector('input[name="attendance"]:checked');
  return sel ? sel.value : null;
}

/**
 * Obtém a lista de nomes de convidados preenchidos
 * @returns {string[]} Array de nomes
 */
function getFilledGuests() {
  return [...guestsList.querySelectorAll('.guest-input')]
    .map(i => i.value.trim())
    .filter(Boolean);
}

/**
 * Atualiza o estado do botão "Confirmar"
 */
function updateConfirmBtn() {
  const hasGuest = getFilledGuests().length > 0;
  const hasAttendance = getAttendance() !== null;
  confirmBtn.disabled = !(hasGuest && hasAttendance);
}

/**
 * Handler para mudanças nos inputs
 */
function onInputChange() {
  updateConfirmBtn();
}

/**
 * Valida o formulário e exibe erros se necessário
 * @returns {boolean} true se válido, false caso contrário
 */
function validateForm() {
  const inputs = [...guestsList.querySelectorAll('.guest-input')];
  
  // Limpa erros antigos
  document.querySelectorAll('.field-error').forEach(e => e.remove());
  inputs.forEach(i => i.classList.remove('invalid'));
  
  let hasError = false;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('invalid');
      const err = document.createElement('p');
      err.className = 'field-error';
      err.textContent = 'Por favor, insira um nome.';
      input.closest('.guest-row').insertAdjacentElement('afterend', err);
      hasError = true;
    }
  });
  
  return !hasError;
}

/**
 * Exibe o estado de sucesso após confirmação
 * @param {string[]} guests - Lista de nomes dos convidados
 * @param {string} attendance - 'yes' ou 'no'
 */
function showSuccess(guests, attendance) {
  formBody.style.transition = 'opacity .3s';
  formBody.style.opacity = '0';
  
  setTimeout(() => {
    formBody.style.display = 'none';

    const going = attendance === 'yes';
    const names = guests.join(', ');
    const plural = guests.length > 1;

    successState.innerHTML = `
      <span class="success-icon" aria-hidden="true">${going ? '🌸' : '🥺'}</span>
      <h2 class="success-title">${going ? 'Até lá!' : 'Que pena!'}</h2>
      <p class="success-msg">
        ${going
          ? `${plural ? 'Presença confirmada para' : 'Presença confirmada para'}<br><em>${names}</em>.<br>Mal podemos esperar para celebrar juntos! ♡`
          : `Recebemos a resposta ${plural ? 'de vocês' : 'de você'}.<br>Sentiremos saudades, ${names.split(',')[0]}. ♡`
        }
      </p>
      <p class="success-names" aria-label="Convidados confirmados">
        ${plural ? '👥 ' + guests.length + ' pessoa' + (guests.length > 1 ? 's' : '') + ' confirmada' + (guests.length > 1 ? 's' : '') : ''}
      </p>
    `;

    successState.style.display = 'block';
  }, 300);
}

/**
 * Envia os dados do RSVP para o backend
 * @param {Object} data - Dados do formulário
 * @returns {Promise<Object>} Resposta do backend
 */
async function submitRSVP(data) {
  try {
    const response = await fetch('/api/guests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        names: data.guests,
        attendance: data.attendance === 'yes' ? 'going' : 'not-going'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao enviar confirmação');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar RSVP:', error);
    throw error;
  }
}

/**
 * Handler do botão "Confirmar"
 */
async function handleConfirm() {
  if (!validateForm()) return;
  
  const guests = getFilledGuests();
  const attendance = getAttendance();
  
  // Prepara dados para envio
  const data = {
    guests,
    attendance,
    event: 'deborah-birthday-2025',
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Desabilita botão durante envio
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Enviando...';
    
    // Envia para backend
    await submitRSVP(data);
    
    // Exibe sucesso
    showSuccess(guests, attendance);
  } catch (error) {
    // Em caso de erro, reabilita o botão
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Confirmar';
    
    // Exibe mensagem de erro
    alert('Erro ao enviar confirmação. Por favor, tente novamente.');
    console.error('Erro:', error);
  }
}

// ── Event Listeners ───────────────────────────────────────

// Botão adicionar convidado
addBtn.addEventListener('click', addGuest);

// Botão confirmar
confirmBtn.addEventListener('click', handleConfirm);

// Radio buttons de presença
document.querySelectorAll('input[name="attendance"]').forEach(radio => {
  radio.addEventListener('change', updateConfirmBtn);
});

// ── Inicialização ─────────────────────────────────────────

// Adiciona o primeiro convidado ao carregar a página
addGuest();

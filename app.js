let tasks = [];
let currentFilter = { priority: '', sort: 'newest', search: '' };
let draggedElement = null;

/** @type {Object<string, {badge: string, card: string}>} */
const priorityStyles = {
  high:   { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', card: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' },
  medium: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', card: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' },
  low:    { badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', card: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' }
};

/** Carrega tarefas do localStorage */
function loadTasks() {
  const saved = localStorage.getItem('tasks');
  tasks = saved ? JSON.parse(saved) : [];
  renderTasks();
}

/** Salva tarefas */
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/** Renderiza estatísticas */
function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById('stats').innerHTML = `
    <div class="bg-white dark:bg-zinc-900 rounded-3xl px-6 py-4 flex-1">
      Total: <strong>${total}</strong>
    </div>
    <div class="bg-white dark:bg-zinc-900 rounded-3xl px-6 py-4 flex-1">
      Concluídas: <strong class="text-green-600">${completed}</strong>
    </div>
    <div class="bg-white dark:bg-zinc-900 rounded-3xl px-6 py-4 flex-1">
      Pendentes: <strong class="text-amber-600">${pending}</strong>
    </div>
  `;
}

/** Cria elemento de tarefa (com drag & drop) */
function createTaskElement(task) {
  const div = document.createElement('div');
  const prio = priorityStyles[task.priority] || priorityStyles.low;

  div.className = `task-card flex items-center gap-5 p-6 rounded-3xl border shadow-sm cursor-grab active:cursor-grabbing ${prio.card}`;
  div.draggable = true;
  div.dataset.id = task.id;

  // ... (HTML completo da tarefa com botão editar)

  // Eventos de drag
  div.addEventListener('dragstart', e => {
    draggedElement = div;
    e.dataTransfer.effectAllowed = 'move';
  });

  // ... (outros eventos)

  return div;
}

/** Renderiza lista com filtros e ordenação */
function renderTasks() {
  const container = document.getElementById('task-list');
  container.innerHTML = '';

  let filtered = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(currentFilter.search);
    const matchesPriority = !currentFilter.priority || task.priority === currentFilter.priority;
    return matchesSearch && matchesPriority;
  });

  // Ordenação
  filtered = sortTasks(filtered);

  filtered.forEach(task => container.appendChild(createTaskElement(task)));
  renderStats();
}

/** Modal de edição (senior level) */
function openEditModal(task) {
  // Cria modal dinamicamente com inputs preenchidos
  // Salva alterações com validação
}

/** Toast system */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 ${type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// === EVENTOS (form, filtros, modal, drag & drop, dark mode) ===

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  // Todos os listeners aqui
});
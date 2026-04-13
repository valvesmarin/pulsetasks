const API_URL = 'https://pulsetasks-kedk.onrender.com/api/v1/tasks';

const translations = {
  es: {
    appTitle: "PulseTasks • Gestor de Tareas",
    addButton: "Añadir",
    taskPlaceholder: "¿Qué necesitas hacer hoy?",
    totalTasks: "Total de tareas",
    completedTasks: "Completadas",
    pendingTasks: "Pendientes",
    allPriorities: "Todas las prioridades",
    allCategories: "Todas las categorías",
    allStates: "Todos los estados",
    priorityHigh: "Alta",
    priorityMedium: "Media",
    priorityLow: "Baja",
    emptyTitle: "Aún no hay tareas",
    emptyMessage: "¡Añade tu primera tarea arriba!",
    themeDark: "Modo Oscuro",
    themeLight: "Claro",
    clearCompleted: "Limpiar completadas",
    markAllCompleted: "Marcar todas como completadas",
    confirmDelete: "¿Eliminar esta tarea?",
    confirmClear: "¿Limpiar todas las tareas completadas?",
    confirmMarkAll: "¿Marcar todas las tareas como completadas?",
    editTitle: "Editar Tarea",
    titleLabel: "Título de la tarea",
    categoryLabel: "Categoría",
    priorityLabel: "Prioridad",
    saveButton: "Guardar cambios",
    cancelButton: "Cancelar",
    Trabajo: "Trabajo",
    Personal: "Personal",
    Estudio: "Estudio",
    Salud: "Salud",
    Otros: "Otros"
  },
  pt: {
    appTitle: "PulseTasks • Gerenciador de Tarefas",
    addButton: "Adicionar",
    taskPlaceholder: "O que precisa ser feito hoje?",
    totalTasks: "Total de tarefas",
    completedTasks: "Concluídas",
    pendingTasks: "Pendentes",
    allPriorities: "Todas as prioridades",
    allCategories: "Todas as categorias",
    allStates: "Todos os estados",
    priorityHigh: "Alta",
    priorityMedium: "Média",
    priorityLow: "Baixa",
    emptyTitle: "Ainda não há tarefas",
    emptyMessage: "Adicione sua primeira tarefa acima!",
    themeDark: "Modo Escuro",
    themeLight: "Claro",
    clearCompleted: "Limpar concluídas",
    markAllCompleted: "Marcar todas como concluídas",
    confirmDelete: "Deseja excluir esta tarefa?",
    confirmClear: "Limpar todas as tarefas concluídas?",
    confirmMarkAll: "Marcar todas as tarefas como concluídas?",
    editTitle: "Editar Tarefa",
    titleLabel: "Título da tarefa",
    categoryLabel: "Categoria",
    priorityLabel: "Prioridade",
    saveButton: "Salvar alterações",
    cancelButton: "Cancelar",
    Trabajo: "Trabalho",
    Personal: "Pessoal",
    Estudio: "Estudo",
    Saúde: "Saúde",
    Otros: "Outros"
  },
  en: {
    appTitle: "PulseTasks • Task Manager",
    addButton: "Add",
    taskPlaceholder: "What needs to be done today?",
    totalTasks: "Total tasks",
    completedTasks: "Completed",
    pendingTasks: "Pending",
    allPriorities: "All priorities",
    allCategories: "All categories",
    allStates: "All states",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    emptyTitle: "No tasks yet",
    emptyMessage: "Add your first task above!",
    themeDark: "Dark Mode",
    themeLight: "Light Mode",
    clearCompleted: "Clear completed",
    markAllCompleted: "Mark all as completed",
    confirmDelete: "Delete this task?",
    confirmClear: "Clear all completed tasks?",
    confirmMarkAll: "Mark all tasks as completed?",
    editTitle: "Edit Task",
    titleLabel: "Task Title",
    categoryLabel: "Category",
    priorityLabel: "Priority",
    saveButton: "Save Changes",
    cancelButton: "Cancel",
    Trabajo: "Work",
    Personal: "Personal",
    Estudio: "Study",
    Saúde: "Health",
    Otros: "Others"
  }
};

let currentLang = localStorage.getItem('lang') || 'es';
let tasks = [];
let filter = { priority: '', category: '', status: '' };
let currentEditingId = null;
let sortableInstance = null;

function t(key) {
  return translations[currentLang][key] || key;
}

// ==================== API ====================
async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
    updateStats();
  } catch (err) {
    console.error(err);
  }
}

async function createTask(title, category, priority) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, priority })
    });
    const newTask = await res.json();
    tasks.unshift(newTask);
    renderTasks();
    updateStats();
  } catch (err) {
    console.error(err);
  }
}

async function updateTask(id, data) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) tasks[index] = { ...tasks[index], ...data };
    renderTasks();
    updateStats();
  } catch (err) {
    console.error(err);
  }
}

async function deleteTask(id) {
  if (!confirm(t('confirmDelete'))) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    updateStats();
  } catch (err) {
    console.error(err);
  }
}

async function deleteCompleted() {
  if (!confirm(t('confirmClear'))) return;
  console.log("🗑️ Botão Limpar Concluídas clicado – enviando DELETE...");
  try {
    const res = await fetch(`${API_URL}/completed`, { method: 'DELETE' });
    console.log("📡 Resposta do backend:", res.status);
    if (res.ok) {
      await loadTasks();
    }
  } catch (err) {
    console.error("Erro ao limpar concluídas:", err);
  }
}

async function markAllCompleted() {
  if (!confirm(t('confirmMarkAll'))) return;
  try {
    await fetch(`${API_URL}/mark-all-completed`, { method: 'POST' });
    await loadTasks();
  } catch (err) {
    console.error(err);
  }
}

// ==================== RENDER + DRAG & DROP ====================
function renderTasks() {
  const container = document.getElementById('task-list');
  container.innerHTML = '';

  let filtered = tasks.filter(task => {
    const matchPriority = !filter.priority || task.priority === filter.priority;
    const matchCategory = !filter.category || task.category === filter.category;
    const matchStatus = !filter.status || (filter.status === 'completed' ? task.completed : !task.completed);
    return matchPriority && matchCategory && matchStatus;
  });

  if (filtered.length === 0) {
    document.getElementById('empty-state').classList.remove('hidden');
    return;
  }
  document.getElementById('empty-state').classList.add('hidden');

  filtered.forEach(task => {
    const div = document.createElement('div');
    const prioText = t(`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`);
    const catText = t(task.category);

    div.className = `task-card flex items-center gap-6 p-7 bg-white dark:bg-zinc-900 rounded-3xl shadow-md border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300`;
    div.draggable = true;
    div.dataset.id = task.id;

    div.innerHTML = `
      <div class="drag-handle cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 text-3xl leading-none pr-4 select-none">≡</div>
      <input type="checkbox" ${task.completed ? 'checked' : ''} class="w-6 h-6 accent-indigo-600 pointer-events-auto">
      <div class="flex-1">
        <p class="text-xl font-medium ${task.completed ? 'line-through text-zinc-500 dark:text-zinc-400' : ''}">${task.title}</p>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">${catText}</p>
      </div>
      <span class="px-7 py-2.5 text-sm font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">${prioText}</span>
      <button class="edit-btn text-blue-500 hover:text-blue-700 px-3 py-2 text-2xl transition-colors pointer-events-auto">✏️</button>
      <button class="delete-btn text-red-500 hover:text-red-700 px-4 py-2 text-2xl transition-colors pointer-events-auto">🗑️</button>
    `;

    // Checkbox atualiza o backend
    div.querySelector('input').addEventListener('change', async () => {
      task.completed = !task.completed;
      await updateTask(task.id, { completed: task.completed });
    });

    div.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(task);
    });

    div.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    container.appendChild(div);
  });

  if (sortableInstance) sortableInstance.destroy();
  sortableInstance = Sortable.create(container, {
    animation: 150,
    ghostClass: 'dragging',
    onEnd: updateTaskOrder
  });
}

function updateTaskOrder() {
  const container = document.getElementById('task-list');
  const newOrder = [...container.querySelectorAll('.task-card')].map(el => parseInt(el.dataset.id));
  tasks = newOrder.map(id => tasks.find(t => t.id === id));
}

// ==================== Stats, Modal, Language, Theme ====================
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById('stats').innerHTML = `
    <div class="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md text-center">
      <p class="text-sm text-zinc-500 dark:text-zinc-400">${t('totalTasks')}</p>
      <p class="text-4xl font-bold text-indigo-600">${total}</p>
    </div>
    <div class="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md text-center">
      <p class="text-sm text-green-600 dark:text-green-400">${t('completedTasks')}</p>
      <p class="text-4xl font-bold text-green-600">${completed}</p>
    </div>
    <div class="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md text-center">
      <p class="text-sm text-amber-600 dark:text-amber-400">${t('pendingTasks')}</p>
      <p class="text-4xl font-bold text-amber-600">${pending}</p>
    </div>
  `;
}

function openEditModal(task) {
  currentEditingId = task.id;
  document.getElementById('modal-title').textContent = t('editTitle');
  document.getElementById('title-label').textContent = t('titleLabel');
  document.getElementById('category-label').textContent = t('categoryLabel');
  document.getElementById('priority-label').textContent = t('priorityLabel');
  document.getElementById('save-edit').textContent = t('saveButton');
  document.getElementById('cancel-edit').textContent = t('cancelButton');

  document.getElementById('edit-title').value = task.title;
  document.getElementById('edit-category').value = task.category;
  document.getElementById('edit-priority').value = task.priority;

  document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
  currentEditingId = null;
}

function populateAllSelects() {
  // category-select, priority-select, edit-category, edit-priority, filters...
  const cats = ['Trabajo','Personal','Estudio','Salud','Otros'];
  const catHTML = cats.map(c => `<option value="${c}">${t(c)}</option>`).join('');
  
  document.getElementById('category-select').innerHTML = catHTML;
  document.getElementById('edit-category').innerHTML = catHTML;

  const prioHTML = `
    <option value="high">${t('priorityHigh')}</option>
    <option value="medium">${t('priorityMedium')}</option>
    <option value="low">${t('priorityLow')}</option>
  `;
  document.getElementById('priority-select').innerHTML = prioHTML;
  document.getElementById('edit-priority').innerHTML = prioHTML;

  document.getElementById('filter-priority').innerHTML = `<option value="">${t('allPriorities')}</option>` + prioHTML;
  document.getElementById('filter-category').innerHTML = `<option value="">${t('allCategories')}</option>` + catHTML;
  document.getElementById('filter-status').innerHTML = `
    <option value="">${t('allStates')}</option>
    <option value="pending">Pendientes</option>
    <option value="completed">Completadas</option>
  `;
}

function applyLanguage() {
  document.getElementById('app-title').textContent = t('appTitle');
  document.getElementById('task-input').placeholder = t('taskPlaceholder');
  document.querySelector('#task-form button').textContent = t('addButton');
  document.getElementById('empty-title').textContent = t('emptyTitle');
  document.getElementById('empty-message').textContent = t('emptyMessage');
  document.getElementById('clear-completed').textContent = t('clearCompleted');
  document.getElementById('mark-all-completed').textContent = t('markAllCompleted');

  populateAllSelects();
  renderTasks();
  updateStats();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
  document.getElementById('theme-text').textContent = isDark ? t('themeLight') : t('themeDark');
}

function init() {
  document.getElementById('lang-select').value = currentLang;
  applyLanguage();

  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') document.documentElement.classList.add('dark');
  toggleTheme();

  loadTasks();

  document.getElementById('task-form').addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('task-input').value.trim();
    if (!title) return;
    await createTask(title, document.getElementById('category-select').value, document.getElementById('priority-select').value);
    e.target.reset();
  });

  document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
  document.getElementById('save-edit').addEventListener('click', async () => {
    if (currentEditingId) {
      await updateTask(currentEditingId, {
        title: document.getElementById('edit-title').value.trim(),
        category: document.getElementById('edit-category').value,
        priority: document.getElementById('edit-priority').value
      });
      closeEditModal();
    }
  });

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('lang-select').addEventListener('change', e => {
    currentLang = e.target.value;
    localStorage.setItem('lang', currentLang);
    applyLanguage();
  });

  document.getElementById('clear-completed').addEventListener('click', deleteCompleted);
  document.getElementById('mark-all-completed').addEventListener('click', markAllCompleted);

  document.getElementById('filter-priority').addEventListener('change', e => { filter.priority = e.target.value; renderTasks(); });
  document.getElementById('filter-category').addEventListener('change', e => { filter.category = e.target.value; renderTasks(); });
  document.getElementById('filter-status').addEventListener('change', e => { filter.status = e.target.value; renderTasks(); });
}

init();
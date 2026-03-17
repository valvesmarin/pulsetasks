const translations = {
  es: {
    appTitle: "PulseTasks • Gestor de Tareas",
    addButton: "Añadir",
    taskPlaceholder: "¿Qué necesitas hacer hoy?",
    allPriorities: "Todas las prioridades",
    priorityHigh: "Alta",
    priorityMedium: "Media",
    priorityLow: "Baja",
    emptyTitle: "Aún no hay tareas",
    emptyMessage: "¡Añade tu primera tarea arriba!",
    themeDark: "Modo Oscuro",
    themeLight: "Claro",
    toastAdded: "Tarea añadida con éxito",
    clearCompleted: "Limpiar completadas",
    markAllCompleted: "Marcar todas como completadas",
    confirmDelete: "¿Eliminar esta tarea?",
    confirmClear: "¿Limpiar todas las tareas completadas?",
    confirmMarkAll: "¿Marcar todas las tareas como completadas?",
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
    allPriorities: "Todas as prioridades",
    priorityHigh: "Alta",
    priorityMedium: "Média",
    priorityLow: "Baixa",
    emptyTitle: "Ainda não há tarefas",
    emptyMessage: "Adicione sua primeira tarefa acima!",
    themeDark: "Modo Escuro",
    themeLight: "Claro",
    toastAdded: "Tarefa adicionada com sucesso",
    clearCompleted: "Limpar concluídas",
    markAllCompleted: "Marcar todas como concluídas",
    confirmDelete: "Deseja excluir esta tarefa?",
    confirmClear: "Limpar todas as tarefas concluídas?",
    confirmMarkAll: "Marcar todas as tarefas como concluídas?",
    Trabajo: "Trabalho",
    Personal: "Pessoal",
    Estudio: "Estudo",
    Salud: "Saúde",
    Otros: "Outros"
  },
  en: {
    appTitle: "PulseTasks • Task Manager",
    addButton: "Add",
    taskPlaceholder: "What needs to be done today?",
    allPriorities: "All priorities",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    emptyTitle: "No tasks yet",
    emptyMessage: "Add your first task above!",
    themeDark: "Dark Mode",
    themeLight: "Light Mode",
    toastAdded: "Task added successfully",
    clearCompleted: "Clear completed",
    markAllCompleted: "Mark all as completed",
    confirmDelete: "Delete this task?",
    confirmClear: "Clear all completed tasks?",
    confirmMarkAll: "Mark all tasks as completed?",
    Trabajo: "Work",
    Personal: "Personal",
    Estudio: "Study",
    Salud: "Health",
    Otros: "Others"
  }
};

let currentLang = localStorage.getItem('lang') || 'es';
let tasks = [];
let filter = { priority: '', category: '', status: '' };

function t(key) {
  return translations[currentLang][key] || key;
}

function applyLanguage() {
  document.getElementById('app-title').textContent = t('appTitle');
  document.getElementById('task-input').placeholder = t('taskPlaceholder');
  document.querySelector('#task-form button').textContent = t('addButton');
  document.getElementById('empty-title').textContent = t('emptyTitle');
  document.getElementById('empty-message').textContent = t('emptyMessage');
  document.getElementById('clear-completed').textContent = t('clearCompleted');
  document.getElementById('mark-all-completed').textContent = t('markAllCompleted');

  renderTasks();
  updateStats();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
  document.getElementById('theme-text').textContent = isDark ? t('themeLight') : t('themeDark');
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById('stats').innerHTML = `
    <div class="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md text-center">
      <p class="text-sm text-zinc-500">${t('totalTasks') || 'Total'}</p>
      <p class="text-4xl font-bold text-indigo-600">${total}</p>
    </div>
    <div class="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md text-center">
      <p class="text-sm text-green-600">${t('completedTasks') || 'Completadas'}</p>
      <p class="text-4xl font-bold text-green-600">${completed}</p>
    </div>
    <div class="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md text-center">
      <p class="text-sm text-amber-600">${t('pendingTasks') || 'Pendentes'}</p>
      <p class="text-4xl font-bold text-amber-600">${pending}</p>
    </div>
  `;
}

document.getElementById('task-form').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('task-input').value.trim();
  if (!title) return;

  tasks.unshift({
    id: Date.now(),
    title,
    category: document.getElementById('category-select').value,
    priority: document.getElementById('priority-select').value,
    completed: false
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  updateStats();
  e.target.reset();
});

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

    div.className = `flex items-center gap-6 p-7 bg-white dark:bg-zinc-900 rounded-3xl shadow-md border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`;
    div.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} class="w-6 h-6 accent-indigo-600">
      <div class="flex-1">
        <p class="text-xl font-medium ${task.completed ? 'line-through text-zinc-500' : ''}">${task.title}</p>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">${catText}</p>
      </div>
      <span class="px-7 py-2.5 text-sm font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
        ${prioText}
      </span>
      <button class="delete-btn text-red-500 hover:text-red-700 px-4 py-2 text-2xl transition-colors">🗑️</button>
    `;

    div.querySelector('input').addEventListener('change', () => {
      task.completed = !task.completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      updateStats();
    });

    div.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(t('confirmDelete'))) {
        tasks = tasks.filter(t => t.id !== task.id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateStats();
      }
    });

    container.appendChild(div);
  });
}

function init() {
  document.getElementById('lang-select').value = currentLang;
  applyLanguage();

  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') document.documentElement.classList.add('dark');
  toggleTheme();

  const saved = localStorage.getItem('tasks');
  if (saved) tasks = JSON.parse(saved);

  renderTasks();
  updateStats();

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  document.getElementById('lang-select').addEventListener('change', e => {
    currentLang = e.target.value;
    localStorage.setItem('lang', currentLang);
    applyLanguage();
  });

  document.getElementById('clear-completed').addEventListener('click', () => {
    if (confirm(t('confirmClear'))) {
      tasks = tasks.filter(t => !t.completed);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      updateStats();
    }
  });

  document.getElementById('mark-all-completed').addEventListener('click', () => {
    if (confirm(t('confirmMarkAll'))) {
      tasks.forEach(t => t.completed = true);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      updateStats();
    }
  });
}

init();
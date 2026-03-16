// ================================================
// PULSETASKS – Versão FINAL (Tudo corrigido e melhorado)
// ================================================

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
    confirmDelete: "¿Eliminar esta tarea?",
    confirmClear: "¿Limpiar todas las tareas completadas?",
    // Categorias – chave = value exato do <option> no HTML
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
    confirmDelete: "Deseja excluir esta tarefa?",
    confirmClear: "Limpar todas as tarefas concluídas?",
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
    confirmDelete: "Delete this task?",
    confirmClear: "Clear all completed tasks?",
    Trabajo: "Work",
    Personal: "Personal",
    Estudio: "Study",
    Salud: "Health",
    Otros: "Others"
  }
};

let currentLang = localStorage.getItem('lang') || 'es';
let tasks = [];

// Função de tradução
function t(key) {
  return translations[currentLang][key] || key;
}

// Atualiza todos os textos fixos e dinâmicos
function applyLanguage() {
  document.getElementById('app-title').textContent = t('appTitle');
  document.getElementById('task-input').placeholder = t('taskPlaceholder');
  document.querySelector('#task-form button').textContent = t('addButton');
  document.getElementById('empty-title').textContent = t('emptyTitle');
  document.getElementById('empty-message').textContent = t('emptyMessage');
  document.getElementById('clear-completed').textContent = t('clearCompleted');

  // Prioridades no select
  document.querySelector('#priority-select option[value="high"]').textContent = t('priorityHigh');
  document.querySelector('#priority-select option[value="medium"]').textContent = t('priorityMedium');
  document.querySelector('#priority-select option[value="low"]').textContent = t('priorityLow');

  renderTasks(); // atualiza cards
}

// Alterna modo escuro
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
  document.getElementById('theme-text').textContent = isDark ? t('themeLight') : t('themeDark');
}

// Adicionar tarefa
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
  e.target.reset();
});

// Renderiza tarefas
function renderTasks() {
  const container = document.getElementById('task-list');
  container.innerHTML = '';

  if (tasks.length === 0) {
    document.getElementById('empty-state').classList.remove('hidden');
    return;
  }

  document.getElementById('empty-state').classList.add('hidden');

  tasks.forEach(task => {
    const div = document.createElement('div');
    const prioText = t(`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`);

    // Categoria traduzida usando o value original
    const catText = t(task.category);

    div.className = `flex items-center gap-6 p-7 bg-white dark:bg-zinc-900 rounded-3xl shadow-md border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`;
    div.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} class="w-6 h-6 accent-indigo-600">
      <div class="flex-1">
        <p class="text-xl font-medium ${task.completed ? 'line-through text-zinc-500 dark:text-zinc-400' : ''}">
          ${task.title}
        </p>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">${catText}</p>
      </div>
      <span class="px-7 py-2.5 text-sm font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
        ${prioText}
      </span>
      <button class="delete-btn text-red-500 hover:text-red-700 px-4 py-2 text-2xl transition-colors" aria-label="Eliminar tarea">
        🗑️
      </button>
    `;

    // Checkbox: risco no título ao marcar como concluída
    div.querySelector('input[type="checkbox"]').addEventListener('change', () => {
      task.completed = !task.completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks(); // re-renderiza para mostrar o risco
    });

    // Excluir tarefa individual
    div.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(t('confirmDelete'))) {
        tasks = tasks.filter(t => t.id !== task.id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
      }
    });

    container.appendChild(div);
  });
}

// Inicialização
function init() {
  document.getElementById('lang-select').value = currentLang;
  applyLanguage();

  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') document.documentElement.classList.add('dark');
  toggleTheme();

  const saved = localStorage.getItem('tasks');
  if (saved) tasks = JSON.parse(saved);

  renderTasks();

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  document.getElementById('lang-select').addEventListener('change', e => {
    currentLang = e.target.value;
    localStorage.setItem('lang', currentLang);
    applyLanguage();
  });

  // Botão Limpiar completadas – agora com confirmação e atualização imediata
  document.getElementById('clear-completed').addEventListener('click', () => {
    if (confirm(t('confirmClear'))) {
      tasks = tasks.filter(t => !t.completed);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  });
}

init();
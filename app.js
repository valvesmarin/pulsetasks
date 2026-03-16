// Traduções completas
const translations = {
  es: {
    appTitle: "PulseTasks • Gestor de Tareas",
    addButton: "Añadir",
    taskPlaceholder: "¿Qué necesitas hacer hoy?",
    allPriorities: "Todas las prioridades",
    allCategories: "Todas las categorías",
    sortNewest: "Más recientes",
    sortOldest: "Más antiguas",
    sortPriority: "Prioridad",
    sortTitle: "Alfabético",
    clearCompleted: "Limpiar completadas",
    editTitle: "Editar Tarea",
    saveButton: "Guardar",
    cancelButton: "Cancelar",
    emptyTitle: "Aún no hay tareas",
    emptyMessage: "¡Añade tu primera tarea arriba!",
    toastAdded: "Tarea añadida con éxito",
    toastUpdated: "Tarea actualizada",
    toastDeleted: "Tarea eliminada",
    toastCleared: "Tareas completadas eliminadas",
    confirmDelete: "¿Realmente deseas eliminar esta tarea?",
    confirmClear: "¿Limpiar todas las tareas completadas?",
    themeDark: "Modo Oscuro",
    themeLight: "Claro",
    priorityHigh: "Alta",
    priorityMedium: "Media",
    priorityLow: "Baja",
    categoryWork: "Trabajo",
    categoryPersonal: "Personal",
    categoryStudy: "Estudio",
    categoryHealth: "Salud",
    categoryOthers: "Otros"
  },
  pt: {
    appTitle: "PulseTasks • Gerenciador de Tarefas",
    addButton: "Adicionar",
    taskPlaceholder: "O que precisa ser feito hoje?",
    allPriorities: "Todas as prioridades",
    allCategories: "Todas as categorias",
    sortNewest: "Mais recentes",
    sortOldest: "Mais antigas",
    sortPriority: "Prioridade",
    sortTitle: "Alfabético",
    clearCompleted: "Limpar concluídas",
    editTitle: "Editar Tarefa",
    saveButton: "Salvar",
    cancelButton: "Cancelar",
    emptyTitle: "Ainda não há tarefas",
    emptyMessage: "Adicione sua primeira tarefa acima!",
    toastAdded: "Tarefa adicionada com sucesso",
    toastUpdated: "Tarefa atualizada",
    toastDeleted: "Tarefa excluída",
    toastCleared: "Tarefas concluídas removidas",
    confirmDelete: "Deseja realmente excluir esta tarefa?",
    confirmClear: "Limpar todas as tarefas concluídas?",
    themeDark: "Modo Escuro",
    themeLight: "Claro",
    priorityHigh: "Alta",
    priorityMedium: "Média",
    priorityLow: "Baixa",
    categoryWork: "Trabalho",
    categoryPersonal: "Pessoal",
    categoryStudy: "Estudo",
    categoryHealth: "Saúde",
    categoryOthers: "Outros"
  },
  en: {
    appTitle: "PulseTasks • Task Manager",
    addButton: "Add",
    taskPlaceholder: "What needs to be done today?",
    allPriorities: "All priorities",
    allCategories: "All categories",
    sortNewest: "Newest first",
    sortOldest: "Oldest first",
    sortPriority: "Priority",
    sortTitle: "Alphabetical",
    clearCompleted: "Clear completed",
    editTitle: "Edit Task",
    saveButton: "Save",
    cancelButton: "Cancel",
    emptyTitle: "No tasks yet",
    emptyMessage: "Add your first task above!",
    toastAdded: "Task added successfully",
    toastUpdated: "Task updated",
    toastDeleted: "Task deleted",
    toastCleared: "Completed tasks cleared",
    confirmDelete: "Do you really want to delete this task?",
    confirmClear: "Clear all completed tasks?",
    themeDark: "Dark Mode",
    themeLight: "Light Mode",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    categoryWork: "Work",
    categoryPersonal: "Personal",
    categoryStudy: "Study",
    categoryHealth: "Health",
    categoryOthers: "Others"
  }
};

let currentLang = localStorage.getItem('lang') || 'es';
let tasks = [];
let currentTaskId = null;
let filter = { priority: '', category: '', sort: 'newest' };

// Estilos de prioridade
const priorityStyles = {
  high:   { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', card: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' },
  medium: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', card: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' },
  low:    { badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', card: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' }
};

// ================================================
// Funções de tradução
// ================================================

function t(key) {
  return translations[currentLang][key] || key;
}

function applyLanguage() {
  document.title = t('appTitle');
  document.getElementById('task-input').placeholder = t('taskPlaceholder');
  document.getElementById('add-button').textContent = t('addButton');

  // Filtro de prioridade
  const prioOpts = document.querySelectorAll('#filter-priority option');
  prioOpts[0].textContent = t('allPriorities');
  prioOpts[1].textContent = t('priorityHigh');
  prioOpts[2].textContent = t('priorityMedium');
  prioOpts[3].textContent = t('priorityLow');

  // Ordenação
  const sortOpts = document.querySelectorAll('#sort-select option');
  sortOpts[0].textContent = t('sortNewest');
  sortOpts[1].textContent = t('sortOldest');
  sortOpts[2].textContent = t('sortPriority');
  sortOpts[3].textContent = t('sortTitle');

  document.getElementById('clear-completed').textContent = t('clearCompleted');

  // Modal
  document.getElementById('modal-title').textContent = t('editTitle');
  document.getElementById('cancel-edit').textContent = t('cancelButton');
  document.getElementById('edit-form button[type="submit"]').textContent = t('saveButton');

  // Empty state
  document.getElementById('empty-title').textContent = t('emptyTitle');
  document.getElementById('empty-message').textContent = t('emptyMessage');

  // Atualiza tema também
  updateThemeButton(document.documentElement.classList.contains('dark'));

  // Re-renderiza tarefas
  renderTasks();
}

// ================================================
// Tema
// ================================================

function updateThemeButton(isDark) {
  const t = translations[currentLang];
  document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
  document.getElementById('theme-text').textContent = isDark ? t.themeLight : t.themeDark;
}

// ================================================
// Inicialização
// ================================================

function init() {
  // Tema
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  updateThemeButton(savedTheme === 'dark');

  // Idioma
  document.getElementById('lang-select').value = currentLang;
  applyLanguage();

  // Carrega tarefas
  const savedTasks = localStorage.getItem('tasks');
  tasks = savedTasks ? JSON.parse(savedTasks) : [];

  renderTasks();
  populateCategories();
  updateStats();
}

// ================================================
// Eventos
// ================================================

document.getElementById('theme-toggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeButton(isDark);
});

document.getElementById('lang-select').addEventListener('change', e => {
  applyLanguage(e.target.value);
});

init();
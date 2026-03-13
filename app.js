let tasks = [];
let currentTaskId = null;
let filter = { priority: '', category: '', sort: 'newest' };

// ================================================
// CONFIGURACIONES Y ESTILOS
// ================================================

const priorityStyles = {
  high:   { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', card: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' },
  medium: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', card: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' },
  low:    { badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', card: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' }
};

/** Carga tareas y tema desde localStorage */
function init() {
  const savedTasks = localStorage.getItem('tasks');
  tasks = savedTasks ? JSON.parse(savedTasks) : [];

  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  updateThemeButton(savedTheme === 'dark');

  renderTasks();
  populateCategories();
  updateStats();
}

/** Actualiza botón de tema */
function updateThemeButton(isDark) {
  document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
  document.getElementById('theme-text').textContent = isDark ? 'Claro' : 'Oscuro';
}

/** Guarda tareas */
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/** Actualiza estadísticas */
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById('stats').innerHTML = `
    <div class="stat-card">
      <p class="text-sm text-zinc-500 dark:text-zinc-400">Total</p>
      <p class="text-3xl font-bold">${total}</p>
    </div>
    <div class="stat-card">
      <p class="text-sm text-green-600 dark:text-green-400">Completadas</p>
      <p class="text-3xl font-bold">${completed}</p>
    </div>
    <div class="stat-card">
      <p class="text-sm text-amber-600 dark:text-amber-400">Pendientes</p>
      <p class="text-3xl font-bold">${pending}</p>
    </div>
  `;
}

/** Llena select de categorías */
function populateCategories() {
  const select = document.getElementById('filter-category');
  const categories = [...new Set(tasks.map(t => t.category))];
  select.innerHTML = '<option value="">Todas las categorías</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

/** Crea elemento de tarea */
function createTaskElement(task) {
  const div = document.createElement('div');
  const prio = priorityStyles[task.priority] || priorityStyles.low;

  div.className = `task-card ${prio.card} ${task.completed ? 'opacity-60' : ''}`;
  div.draggable = true;
  div.dataset.id = task.id;

  div.innerHTML = `
    <input type="checkbox" ${task.completed ? 'checked' : ''} class="w-5 h-5 accent-indigo-600 cursor-pointer" />
    <div class="flex-1">
      <p class="text-lg font-medium ${task.completed ? 'line-through text-zinc-500' : ''}">${task.title}</p>
      <p class="text-sm text-zinc-500 dark:text-zinc-400">${task.category}</p>
    </div>
    <span class="badge ${prio.badge}">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}</span>
    <button class="edit-btn text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 px-3 py-2" aria-label="Editar tarea">✏️</button>
    <button class="delete-btn text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-3 py-2" aria-label="Eliminar tarea">🗑️</button>
  `;

  // Eventos
  div.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleComplete(task.id));
  div.querySelector('.edit-btn').addEventListener('click', () => openEditModal(task));
  div.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

  // Drag & Drop
  div.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', task.id);
    div.classList.add('opacity-50');
  });

  div.addEventListener('dragend', () => div.classList.remove('opacity-50'));

  div.addEventListener('dragover', e => e.preventDefault());

  div.addEventListener('drop', e => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId !== task.id) reorderTasks(draggedId, task.id);
  });

  return div;
}

/** Reordena tareas con drag & drop */
function reorderTasks(draggedId, targetId) {
  const draggedIndex = tasks.findIndex(t => t.id == draggedId);
  const targetIndex = tasks.findIndex(t => t.id == targetId);

  if (draggedIndex === -1 || targetIndex === -1) return;

  const [draggedTask] = tasks.splice(draggedIndex, 1);
  tasks.splice(targetIndex, 0, draggedTask);

  saveTasks();
  renderTasks();
}

/** Renderiza lista de tareas */
function renderTasks() {
  const container = document.getElementById('task-list');
  const empty = document.getElementById('empty-state');
  container.innerHTML = '';

  let filtered = tasks.filter(task => {
    const matchPriority = !filter.priority || task.priority === filter.priority;
    const matchCategory = !filter.category || task.category === filter.category;
    return matchPriority && matchCategory;
  });

  // Ordenación
  filtered = filtered.sort((a, b) => {
    if (filter.sort === 'newest') return b.id - a.id;
    if (filter.sort === 'oldest') return a.id - b.id;
    if (filter.sort === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (filter.sort === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  if (filtered.length === 0) {
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    filtered.forEach(task => container.appendChild(createTaskElement(task)));
  }

  updateStats();
}

/** Añade nueva tarea */
document.getElementById('task-form').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('task-input').value.trim();
  if (!title) return showToast('Escribe una tarea', 'error');

  const newTask = {
    id: Date.now(),
    title,
    category: document.getElementById('category-select').value,
    priority: document.getElementById('priority-select').value,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  e.target.reset();
  showToast('Tarea añadida con éxito', 'success');
  populateCategories();
});

/** Marca/desmarca completada */
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

/** Abre modal de edición */
function openEditModal(task) {
  currentTaskId = task.id;
  document.getElementById('edit-title').value = task.title;
  document.getElementById('edit-category').value = task.category;
  document.getElementById('edit-priority').value = task.priority;
  document.getElementById('edit-modal').classList.remove('hidden');
}

/** Guarda edición */
document.getElementById('edit-form').addEventListener('submit', e => {
  e.preventDefault();
  const task = tasks.find(t => t.id === currentTaskId);
  if (task) {
    task.title = document.getElementById('edit-title').value.trim();
    task.category = document.getElementById('edit-category').value;
    task.priority = document.getElementById('edit-priority').value;
    saveTasks();
    renderTasks();
    closeModal();
    showToast('Tarea actualizada', 'success');
  }
});

/** Cierra modal */
function closeModal() {
  document.getElementById('edit-modal').classList.add('hidden');
  currentTaskId = null;
}

document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('cancel-edit').addEventListener('click', closeModal);

/** Elimina tarea */
function deleteTask(id) {
  if (!confirm('¿Realmente deseas eliminar esta tarea?')) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
  showToast('Tarea eliminada', 'success');
  populateCategories();
}

/** Limpia completadas */
document.getElementById('clear-completed').addEventListener('click', () => {
  if (!confirm('¿Limpiar todas las tareas completadas?')) return;
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
  showToast('Tareas completadas eliminadas', 'success');
});

/** Toast */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} translate-y-0 opacity-100`;
  setTimeout(() => {
    toast.className = `toast hidden`;
  }, 3000);
}

/** Tema */
document.getElementById('theme-toggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeButton(isDark);
});

/** Filtros */
document.getElementById('filter-priority').addEventListener('change', e => {
  filter.priority = e.target.value;
  renderTasks();
});

document.getElementById('filter-category').addEventListener('change', e => {
  filter.category = e.target.value;
  renderTasks();
});

document.getElementById('sort-select').addEventListener('change', e => {
  filter.sort = e.target.value;
  renderTasks();
});

/** Iniciar */
init();
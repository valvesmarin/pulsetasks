let tasks = [];

// Cores para prioridade (badge + fundo da tarefa)
const priorityStyles = {
  high: {
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    task:  'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
  },
  medium: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    task:  'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
  },
  low: {
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    task:  'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
  }
};

// Load tasks
function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) tasks = JSON.parse(saved);
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
  const div = document.createElement('div');

  // Pega as classes de prioridade (ou fallback cinza)
  const prio = priorityStyles[task.priority] || {
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    task:  'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
  };

  // Classe base + cor da prioridade + completed
  div.className = `flex items-center gap-4 p-5 rounded-3xl shadow-sm border transition-all hover:shadow 
    bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 
    ${prio.task} ${task.completed ? 'opacity-75' : ''}`;
  div.dataset.id = task.id;

  div.innerHTML = `
    <input type="checkbox" class="task-check w-5 h-5 accent-blue-600" ${task.completed ? 'checked' : ''}>
    <div class="flex-1">
      <span class="title block text-lg font-medium ${task.completed ? 'line-through text-zinc-500' : ''}">${task.title}</span>
      <span class="category text-sm text-zinc-500 dark:text-zinc-400">${task.category}</span>
    </div>
    <span class="badge px-4 py-1 text-xs font-semibold rounded-full ${prio.badge}">
      ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
    </span>
    <button class="delete-btn w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-2xl transition-all">🗑️</button>
  `;

  div.querySelector('.task-check').addEventListener('change', () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  });

  div.querySelector('.delete-btn').addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  return div;
}

function renderTasks(filter = '') {
  const container = document.getElementById('task-list');
  container.innerHTML = '';
  const filtered = tasks.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));
  filtered.forEach(task => container.appendChild(createTaskElement(task)));
}

// Form
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

  saveTasks();
  renderTasks();
  e.target.reset();
});

// Search
document.getElementById('search-input').addEventListener('input', e => renderTasks(e.target.value));

// MODO ESCURO 
const toggle = document.getElementById("dark-mode-toggle");
toggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  toggle.textContent = document.documentElement.classList.contains("dark") ? "Modo Claro" : "Modo Oscuro";
});

// Start
loadTasks();
let tasks = [];

const priorityStyles = {
  high:   { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', card: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' },
  medium: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', card: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' },
  low:    { badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', card: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' }
};

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
  const prio = priorityStyles[task.priority] || priorityStyles.low;

  div.className = `task-card flex items-center gap-5 p-6 rounded-3xl border shadow-sm ${prio.card} ${task.completed ? 'opacity-75' : ''}`;
  div.dataset.id = task.id;

  div.innerHTML = `
    <input type="checkbox" class="task-check w-6 h-6 accent-blue-600 cursor-pointer" ${task.completed ? 'checked' : ''}>
    <div class="flex-1">
      <p class="title text-xl font-medium text-zinc-900 dark:text-white ${task.completed ? 'line-through text-zinc-500' : ''}">${task.title}</p>
      <p class="category text-sm text-zinc-500 dark:text-zinc-400 mt-1">${task.category}</p>
    </div>
    <span class="badge px-6 py-2 text-sm font-semibold rounded-3xl ${prio.badge}">
      ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
    </span>
    <button class="delete-btn w-11 h-11 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-3xl transition-all text-2xl">🗑️</button>
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
  const empty = document.getElementById('empty-state');
  container.innerHTML = '';

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    filtered.forEach(task => container.appendChild(createTaskElement(task)));
  }
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

// Modo escuro
const toggleBtn = document.getElementById('dark-mode-toggle');
const icon = document.getElementById('theme-icon');
const text = document.getElementById('theme-text');

function updateTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    icon.textContent = '☀️';
    text.textContent = 'Modo Claro';
  } else {
    document.documentElement.classList.remove('dark');
    icon.textContent = '🌙';
    text.textContent = 'Modo Escuro';
  }
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

updateTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

toggleBtn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark');
  updateTheme(!isDark);
});

loadTasks();
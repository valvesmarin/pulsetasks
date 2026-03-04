let tasks = [];

// Carregar tarefas do LocalStorage
function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  renderTasks();
}

// Salvar no LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Criar elemento de tarefa
function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = `task ${task.completed ? 'completed' : ''}`;
  div.dataset.id = task.id;

  div.innerHTML = `
    <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''}>
    <div class="task-content">
      <span class="title">${task.title}</span>
      <span class="category">${task.category}</span>
    </div>
    <span class="badge ${task.priority}">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}</span>
    <button class="delete-btn">🗑️</button>
  `;

  // Checkbox
  div.querySelector('.task-check').addEventListener('change', () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  });

  // Botão eliminar
  div.querySelector('.delete-btn').addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  return div;
}

// Renderizar lista (com filtro opcional)
function renderTasks(filterText = '') {
  const container = document.getElementById('task-list');
  container.innerHTML = '';

  const filtered = tasks.filter(task =>
    task.title.toLowerCase().includes(filterText.toLowerCase())
  );

  filtered.forEach(task => {
    container.appendChild(createTaskElement(task));
  });
}

// Adicionar nova tarefa
document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('task-input').value.trim();
  const category = document.getElementById('category-select').value;
  const priority = document.getElementById('priority-select').value;

  if (!title) return;

  const newTask = {
    id: Date.now(),
    title: title,
    category: category,
    priority: priority,
    completed: false
  };

  tasks.unshift(newTask); // adiciona no topo
  saveTasks();
  renderTasks();

  // Limpar formulário
  e.target.reset();
}); 

  // Filtro de busca
document.getElementById('search-input').addEventListener('input', (e) => {
  renderTasks(e.target.value);   // atualiza em tempo real enquanto você digita
});

// Dark mode (mantido)
const toggle = document.getElementById("dark-mode-toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggle.textContent = document.body.classList.contains("dark-mode") ? "Modo Claro" : "Modo Oscuro";
});

// Iniciar a aplicação
loadTasks();
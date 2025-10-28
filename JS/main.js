// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check previously saved theme
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// ---- CRUD Functions ----

// GET: fetch todos from server
async function getTodos() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  toDoList.innerHTML = '';

  todos.forEach(todo => {
    const toDoDiv = document.createElement('div');
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);
    if (todo.done) toDoDiv.classList.add('completed');

    const newToDo = document.createElement('li');
    newToDo.innerText = todo.text;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    checked.dataset.id = todo.id;
    toDoDiv.appendChild(checked);

    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    deleted.dataset.id = todo.id;
    toDoDiv.appendChild(deleted);

    toDoList.appendChild(toDoDiv);
  });
}

// POST: add new todo
async function addToDo(event) {
  event.preventDefault();
  const text = toDoInput.value.trim();
  if (!text) {
    alert('You must write something!');
    return;
  }

  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (res.ok) {
    toDoInput.value = '';
    getTodos();
  }
}

// DELETE or TOGGLE
async function deletecheck(event) {
  const item = event.target;
  if (item.closest('.delete-btn')) {
    const id = item.closest('.delete-btn').dataset.id;
    const parent = item.closest('.todo');
    parent.classList.add('fall');
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    parent.addEventListener('transitionend', () => parent.remove());
  } else if (item.closest('.check-btn')) {
    const id = item.closest('.check-btn').dataset.id;
    await fetch(`/api/todos/${id}`, { method: 'PUT' });
    getTodos();
  }
}

// ---- Theme Management ----
function changeTheme(color) {
  localStorage.setItem('savedTheme', color);
  savedTheme = localStorage.getItem('savedTheme');

  document.body.className = color;
  color === 'darker'
    ? document.getElementById('title').classList.add('darker-title')
    : document.getElementById('title').classList.remove('darker-title');

  document.querySelector('input').className = `${color}-input`;

  document.querySelectorAll('.todo').forEach(todo => {
    Array.from(todo.classList).some(item => item === 'completed')
      ? (todo.className = `todo ${color}-todo completed`)
      : (todo.className = `todo ${color}-todo`);
  });

  document.querySelectorAll('button').forEach(button => {
    Array.from(button.classList).some(item => {
      if (item === 'check-btn') {
        button.className = `check-btn ${color}-button`;
      } else if (item === 'delete-btn') {
        button.className = `delete-btn ${color}-button`;
      } else if (item === 'todo-btn') {
        button.className = `todo-btn ${color}-button`;
      }
    });
  });
}

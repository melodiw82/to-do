const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'todos.json');

// Helper: read todos from file
function readTodos() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper: save todos to file
function saveTodos(todos) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
}

// GET /api/todos?done=true
router.get('/', (req, res) => {
  const todos = readTodos();
  if (req.query.done === 'true') return res.json(todos.filter(t => t.done));
  if (req.query.done === 'false') return res.json(todos.filter(t => !t.done));
  res.json(todos);
});

// POST /api/todos
router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Todo text is required' });

  const todos = readTodos();
  const id = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  const todo = { id, text: text.trim(), done: false };
  todos.push(todo);
  saveTodos(todos);
  res.status(201).json(todo);
});

// PUT /api/todos/:id
router.put('/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  todo.done = !todo.done;
  saveTodos(todos);
  res.json(todo);
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  let todos = readTodos();
  const index = todos.findIndex(t => t.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  todos.splice(index, 1);
  saveTodos(todos);
  res.status(204).end();
});

module.exports = router;

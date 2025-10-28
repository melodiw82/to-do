const express = require('express');
const router = express.Router();

let todos = [];
let id = 1;

// GET all todos, optional filter by ?done=true or ?done=false
router.get('/', (req, res) => {
  const { done } = req.query;

  if (done === 'true') {
    return res.json(todos.filter(todo => todo.done === true));
  } else if (done === 'false') {
    return res.json(todos.filter(todo => todo.done === false));
  } else {
    return res.json(todos);
  }
});

// POST: add a new todo
router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  const todo = { id: id++, text: text.trim(), done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT: toggle todo done/undone
router.put('/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  todo.done = !todo.done;
  res.json(todo);
});

// DELETE: remove todo
router.delete('/:id', (req, res) => {
  const index = todos.findIndex(t => t.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  todos.splice(index, 1);
  res.status(204).end();
});

module.exports = router;

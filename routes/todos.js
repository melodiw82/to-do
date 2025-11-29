const express = require('express');

function createTodosRouter(client) {
  const router = express.Router();

  // GET all todos
  router.get('/', async (req, res) => {
    const ids = await client.lRange("todo:ids", 0, -1);

    const todos = [];
    for (const id of ids) {
      const data = await client.get(`todo:${id}`);
      if (data) todos.push(JSON.parse(data));
    }
    res.json(todos);
  });

  // POST: add a new todo
  router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    // Auto-increment ID
    const id = await client.incr("todo:id");

    const todo = {
      id,
      text: text.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };

    // Save todo and its ID reference
    await client.set(`todo:${id}`, JSON.stringify(todo));
    await client.rPush("todo:ids", id.toString());

    res.status(201).json(todo);
  });

  // PUT: toggle todo done/undone
  router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const oldTodo = await client.get(`todo:${id}`);

    if (!oldTodo) return res.status(404).json({ error: "Todo not found" });

    const { text, done } = req.body;
    const updated = {
      ...JSON.parse(oldTodo),
      text,
      done,
    };

    await client.set(`todo:${id}`, JSON.stringify(updated));

    res.json(updated);
  });

  // DELETE: remove todo
  router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const deleted = await client.del(`todo:${id}`);
    if (deleted === 0)
      return res.status(404).json({ error: "Todo not found" });

    await client.lRem("todo:ids", 1, id);

    res.status(204).end();
  });

  return router;
}

module.exports = createTodosRouter;

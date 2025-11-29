const express = require('express');
const { ObjectId } = require('mongodb');

function createTodosRouter(db) {
  const router = express.Router();
  const todosCollection = db.collection('todos');

  // GET all todos
  router.get('/', async (req, res) => {
    const todos = await todosCollection.find().toArray();
    res.json(todos);
  });

  // POST: add a new todo
  router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    const todo = {
      text: text.trim(),
      done: false,
      createdAt: new Date()
    };
    
    const result = await todosCollection.insertOne(todo);
    res.status(201).json({_id: result.insertedId, ...todo});
  });

  // PUT: toggle todo done/undone
  router.put('/:id', async (req, res) => {
    const { text, done } = req.body;
    
    const result = await todosCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { text, done } },
      { returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ error: 'Todo not found' });
    res.json(result.value);
  });

  // DELETE: remove todo
  router.delete('/:id', async (req, res) => {
    const result = await todosCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).end();
  });

  return router;
}

module.exports = createTodosRouter;

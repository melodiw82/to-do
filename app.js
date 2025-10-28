const express = require('express');
const path = require('path');
const morgan = require('morgan');
const todosRouter = require('./routes/todos');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev')); // Logging
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/todos', todosRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

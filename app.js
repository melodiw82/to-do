const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const todosRouter = require('./routes/todos');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// CORS for GitHub Pages frontend
app.use(cors({
  origin: 'https://melodiw82.github.io', 
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Serve static files (CSS/JS) from current folder
app.use(express.static(path.join(__dirname)));

// Serve index.html from root for /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

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

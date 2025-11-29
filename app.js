require("dotenv").config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const { MongoClient } = require("mongodb");

const todosRouter = require('./routes/todos');

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// CORS for GitHub Pages frontend
app.use(cors({
    origin: '*',          // allow all domains
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type']
  }));

// ------- MongoDB Connection -------
let db;
const client = new MongoClient(process.env.MONGODB_URI);

async function start() {
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log("Connected to MongoDB Atlas");

  // Pass db client to routes
  app.use('/api/todos', todosRouter(db));

  // Serve static files (CSS/JS) from current folder
  app.use(express.static(path.join(__dirname)));

  // Serve index.html from root for /
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  // 404 handler
  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  // Centralized error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  });

  app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));
}

start();

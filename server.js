const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

// Configurar CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

// Configurar Body Parser
app.use(bodyParser.json());

let currentEmployee = null; // Variável para armazenar o funcionário atual

// Endpoint REST para salvar feedback completo
app.post('/api/feedback', async (req, res) => {
  const { rating, found } = req.body;
  try {
    await db('feedback').insert({ rating, found, employee: currentEmployee });
    console.log(`Received rating: ${rating}, found: ${found}, employee: ${currentEmployee}`);
    res.status(200).send({ message: "Feedback received" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to save feedback" });
  }
});

// Endpoint REST para buscar todos os feedbacks
app.get('/api/feedback/all', async (req, res) => {
  try {
    const feedbacks = await db('feedback').select();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch feedbacks" });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('start', ({ employee }) => {
    console.log(`Voting started by: ${employee}`);
    currentEmployee = employee; // Armazena o funcionário atual
    io.emit('startVoting', { employee });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Iniciar o servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

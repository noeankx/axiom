require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/axiom_logs';

mongoose.connect(MONGO_URI)
  .then(() => console.log('[Database] Connected to MongoDB'))
  .catch(err => console.error('[Database] Connection Error:', err));

// Initialize Socket Service
const { initSocketService } = require('./services/socketService');
initSocketService(io);

// Start Simulator (Auto-start for Demo)
const simulator = require('./simulator/logGenerator');
simulator.start();

// Routes
const apiRoutes = require('./routes/api');
app.use('/api/logs', apiRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Axiom Server is Running (MongoDB)');
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Handle Stress Lab Controls
  socket.on('stress_control', (data) => {
    console.log('[Stress Control] Received:', data);
    
    if (data.type === 'UPDATE_CONFIG') {
        simulator.updateConfig(data.payload);
    } else if (data.type === 'INJECT_SCENARIO') {
        simulator.injectScenario(data.payload);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
});

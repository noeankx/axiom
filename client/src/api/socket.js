import { io } from 'socket.io-client';

// For local development, assume backend is on port 3001
const BACKEND_URL = 'http://localhost:3001';

export const socket = io(BACKEND_URL, {
  autoConnect: true,
  reconnection: true,
});

import express from 'express';
import startServer from './startServer';
import { Server } from 'socket.io';

const app = express();
export const port = 9000;

startServer(app).then((server) => {
  const io = new Server(server, { 
    cors: {
      origin: "http://localhost:3000"
    }
})

  io.on('connection', (socket) => {
    console.log('Client connected');

    // Handle socket events here

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  console.log(`Server is running on http://localhost:${port}`);
});

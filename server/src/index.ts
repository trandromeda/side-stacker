import express from 'express';
import startServer from './startServer.js';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
export const port = 9000;
export const io = new Server(http.createServer(app), {
    cors: {
      origin: "http://localhost:3000"
    }
});
io.listen(9001);
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

startServer(app).then((_server) => {
  console.log(`Server is running on http://localhost:${port}`);
});

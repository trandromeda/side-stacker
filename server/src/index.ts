import express from 'express';
import startServer from './startServer';

const app = express();
export const port = 9000;

startServer(app).then(() => {
  console.log(`Server is running on http://localhost:${port}`);
});

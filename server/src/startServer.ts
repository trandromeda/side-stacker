import { Express } from 'express';
import cors from 'cors';

import sequelize from './db';
import Game from './models/game.model';
import gamesRouter from './routes/games.route';
import { port } from './server';

export default async function startServer(app: Express) {
  // Sync models with database
  await sequelize.sync({force: true});

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  
  // Add middleware and routes to the app
  app.use(cors());
  app.use('/games', gamesRouter);

  return app.listen(port);
}
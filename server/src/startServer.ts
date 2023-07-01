import { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import sequelize from './db.js';
import Game from './models/game.model.js';
import gamesRouter from './routes/games.route.js';
import { port } from './index.js';

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
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use('/games', gamesRouter);

  return app.listen(port);
}
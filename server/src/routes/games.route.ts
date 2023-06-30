import { Router, Request, Response } from 'express';
import Game from '../models/game.model';

const router = Router();

type Board = Array<Array<number>>;
const DIMENSIONS = 7;

function createBoard(dimensions: number) {
    const board: Board = [];
    for (let i = 0; i < dimensions; i++) {
      board[i] = [];
      for (let j = 0; j < dimensions; j++) {
        board[i][j] = 0;
      }
    }
    return board;
  }

router.post('/', async (_req: Request, res: Response) => {
  try {
    const board = createBoard(DIMENSIONS)
    const game = await Game.create({ current_player: 1, board });
    res.status(201).json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
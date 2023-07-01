import { Router, Request, Response } from 'express';
import Game from '../models/game.model.js';
import checkHasWinner from '../utils/check-winner.js';
import { io } from '../index.js';

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
    // Sequelize will serialize the board object into a string
    return board as unknown as string;
  }

  // New game
router.post('/', async (_req: Request, res: Response) => {
  try {
    const board = createBoard(DIMENSIONS)
    const game = await Game.create({ currentPlayer: 1, board });
    res.status(201).json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve existing game
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const game = await Game.findByPk(req.params.id);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    console.error(`Error getting game with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update current game
router.post('/:id', async (req: Request, res: Response) => {
  try {
    const game = await Game.findByPk(req.params.id);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const { currentPlayer, row, col, direction } = req.body;

    if (currentPlayer !== game.currentPlayer) {
      return res.status(400).json({ error: 'Invalid player' });
    }

    const board = JSON.parse(JSON.stringify(game.board));

    // validate the move is valid
    let left = 0;
    let right = DIMENSIONS - 1;

    while (board[row][left] !== 0 && left < DIMENSIONS - 1) {
      left++;
    }

    while (board[row][right] !== 0 && right > 0) {
      right--;
    }

    const isInvalidMove = (direction === 'left' && col !== left) || (direction === 'right' && col !== right);
    if (isInvalidMove) {
      return res.status(400).json({ error: 'Invalid move. No cheating!' });
    } 

    // update the board and player turn
    const token = currentPlayer === 1 ? 1 : -1
    board[row][col] = token;

    // check if there's a winner
    let winningPositions = checkHasWinner(board, token);

    if (winningPositions.length > 0) {
      game.winner = currentPlayer;
      game.winningPositions = winningPositions  as unknown as string;
    }

    game.board = board;
    game.currentPlayer = currentPlayer === 1 ? 2 : 1;

    io.emit('game-updated', game);
    await game.save();

    res.json(game);
  } catch (error) {
    console.error(`Error updating game with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
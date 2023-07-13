import { Router, Request, Response } from "express";
import Game from "../models/game.model.js";
import checkHasWinner from "../utils/check-winner.js";
import { io } from "../index.js";

const router = Router();
const DIMENSIONS = 7;

type Board = Array<Array<number>>;

// New game
router.post("/", async (_req: Request, res: Response) => {
    try {
        const board = createBoard(DIMENSIONS, []);
        const players = [1];
        const game = await Game.create({ currentPlayer: 1, players });
        res.status(201).json({
            ...game.toJSON(),
            board
        });
    } catch (error) {
        console.error("Error creating game:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Retrieve existing game, i.e join a game
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const game = await Game.findByPk(req.params.id);

        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        if (game.players.length === 2) {
            return res.status(400).json({ error: "Game is full" });
        } else if (game.players.length === 1) {
            game.players = [1,2]
        }
        const board = createBoard(DIMENSIONS, game.moves);

        res.json({
            ...game.toJSON(),
            board
        });
    } catch (error) {
        console.error(`Error getting game with ID ${req.params.id}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update current game
router.post("/:id", async (req: Request, res: Response) => {
    try {
        const game = await Game.findByPk(req.params.id);

        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        const { currentPlayer, row, col, direction } = req.body;
        const board = createBoard(DIMENSIONS, game.moves || []);

        const error = checkIsInvalid(
            game,
            board,
            currentPlayer,
            row,
            col,
            direction
        );

        if (error) {
            return res.status(400).json(error);
        }

        // update the board and player turn
        const token = currentPlayer === 1 ? 1 : -1;
        board[row][col] = token;

        // check if there's a winner
        let winningPositions = checkHasWinner(board, token);

        if (winningPositions.length > 0) {
            game.winner = currentPlayer;
            game.winningPositions = winningPositions as unknown as string;
        }

        game.currentPlayer = currentPlayer === 1 ? 2 : 1;

        // save move history
        const move: Move = {
            player: currentPlayer,
            move: [row, col]
        }
        const moves = game.moves || []
        const mergedMoves = moves.concat(move);
        game.moves = mergedMoves;

        await game.save();

        // notify other player
        io.emit("game-updated", {
            ...game.toJSON(), 
            board
        });

        res.json({...game.toJSON(), board});
    } catch (error) {
        console.error(`Error updating game with ID ${req.params.id}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});

type Move = {
    player: number;
    move: [number, number];
};

function createBoard(dimensions: number, moves?: Array<Move>) {
    const board: Board = [];
    for (let i = 0; i < dimensions; i++) {
        board[i] = [];
        for (let j = 0; j < dimensions; j++) {
            let token;
            // if [i, j] is in moves array, set board[i][j] to player number
            if (
                moves?.find((move) => {
                    token = move.player === 1 ? 1 : -1;
                    return move.move[0] === i && move.move[1] === j;
                })
            ) {
                board[i][j] = token || 0;
            } else {
                board[i][j] = 0;
            }
        }
    }
    // Sequelize will serialize the board object into a string
    return board;
}

function checkIsInvalid(
    game: Game,
    board: Board,
    currentPlayer: number,
    row: number,
    col: number,
    direction: string
) {
    if (currentPlayer !== game.currentPlayer) {
        return {
            error: "Not your turn!",
        };
    }

    let left = 0;
    let right = DIMENSIONS - 1;

    while (board[row][left] !== 0 && left < DIMENSIONS - 1) {
        left++;
    }

    while (board[row][right] !== 0 && right > 0) {
        right--;
    }

    const isInvalidMove =
        (direction === "left" && col !== left) ||
        (direction === "right" && col !== right);
    if (isInvalidMove) {
        return {
            error: "Invalid move. No cheating!",
        };
    }

    return false;
}

export default router;

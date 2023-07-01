import { Board } from "../types/game.types";

export function createBoard(dimensions: number) {
    const board: Board = [];
    for (let i = 0; i < dimensions; i++) {
        board[i] = [];
        for (let j = 0; j < dimensions; j++) {
            board[i][j] = 0;
        }
    }
    return board;
}
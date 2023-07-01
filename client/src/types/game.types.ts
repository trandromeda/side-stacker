export type Player = 1 | 2 | undefined;

export interface GameState {
    id?: number;
    currentPlayer: Player;
    players: Array<Player>;
    winner: Player;
    winningPositions?: Array<[number, number]>;
}

export type Board = Array<Array<number>>;
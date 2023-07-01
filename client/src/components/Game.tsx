import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useImmer } from "use-immer";

import Dashboard from "./Dashboard";
import BoardComponent from "./Board";
import { Board, GameState, Player } from "../types/game.types";
import { createBoard } from "../utils/createBoard";
import { ENDPOINT, useGameQuery } from "../utils/gameQuery";

interface GameProps {
    id?: number;
    gamesPlayed: number;
    isSinglePlayer: boolean;
}

const DIMENSIONS = 7;
const initialGameState: GameState = {
    id: undefined,
    currentPlayer: 1,
    players: [],
    winner: undefined,
};
const socket = io("http://localhost:9001");

function Game({ id, gamesPlayed, isSinglePlayer }: GameProps) {
    const [board, setBoard] = useState<Board>(createBoard(DIMENSIONS));
    const [game, setGame] = useImmer<GameState>(initialGameState);
    const [player, setPlayer] = useState<Player>(undefined);

    /*
     * Fetch game
     */
    const { data, isLoading, isError } = useGameQuery(gamesPlayed, id);

    // Sync local state with server state
    useEffect(() => {
        if (data) {
            setBoard(data.board)
            setGame((draft) => {
                draft.id = data.id;
                draft.winner = data.winner;
                draft.winningPositions = data.winningPositions;
                draft.currentPlayer = data.currentPlayer;
            });
            const playerId = data.players.length === 1 ? 1 : 2
            setPlayer(playerId)

        }
    }, [data, id, setGame]);

    // Sync local state with socket event i.e other player's move
    useEffect(() => {
        socket.on("connect", () => console.log('Connected to: ' + socket.id));
        socket.on("game-updated", (payload: GameState & { board: Board }) => {
            setBoard(payload.board)
            setGame((draft) => {
                draft.currentPlayer = payload.currentPlayer;
                draft.winner = payload.winner;
                draft.winningPositions = payload.winningPositions;
            })
        });

        return () => {
            socket.off("game-updated");
        };
    }, [setGame]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Error!</p>;
    }

    const handlePlayerTurn = async ({
        row,
        col,
        direction,
    }: {
        row: number;
        col: number;
        direction: "L" | "R";
    }) => {
        if (game.winner) return;

        const payload = {
            currentPlayer: game.currentPlayer,
            row,
            col,
            direction,
        };
        try {
            await fetch(`${ENDPOINT}/${game.id}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <Dashboard game={game} player={player} isSinglePlayer={isSinglePlayer} />
            <BoardComponent
                board={board}
                isCurrentTurn={game.currentPlayer === player || isSinglePlayer}
                handlePlayerTurn={handlePlayerTurn}
                winningPositions={game.winningPositions}
            ></BoardComponent>
        </>
    );
}

export default Game;

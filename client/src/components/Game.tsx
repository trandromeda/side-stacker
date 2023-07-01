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
}

const DIMENSIONS = 7;
const initialGameState: GameState = {
    id: undefined,
    currentPlayer: 1,
    winner: undefined,
};
const socket = io("http://localhost:9001");

function Game({ id, gamesPlayed }: GameProps) {
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
        }
    }, [data, id]);

    // Sync local state with socket event i.e other player's move
    useEffect(() => {
        socket.on("connect", () => console.log(socket.id));
        socket.on("game-updated", (payload: GameState & { board: Board }) => {
            // setGame(payload);
        });

        return () => {
            socket.off("game-updated");
        };
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Error!</p>;
    }

    const updateGame = async ({
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
            const response = await fetch(`${ENDPOINT}/${game.id}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const updatedGame = await response.json();
            const updatedBoard = updatedGame.board;

            setBoard(updatedBoard);
            setGame((draft) => {
                draft.currentPlayer = draft.currentPlayer === 1 ? 2 : 1;
                draft.winner = updatedGame.winner;
                draft.winningPositions = updatedGame.winningPositions || [];
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <Dashboard game={game} />
            <BoardComponent
                board={board}
                updateBoard={updateGame}
                winningPositions={game.winningPositions}
            ></BoardComponent>
        </>
    );
}

export default Game;

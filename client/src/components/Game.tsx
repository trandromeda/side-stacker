import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useImmer } from "use-immer";
import styled from "styled-components";

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

const ErrorMessage = styled.p`
    text-align: center;
    color: red;
`;

function Game({ id, gamesPlayed, isSinglePlayer }: GameProps) {
    const [board, setBoard] = useState<Board>(createBoard(DIMENSIONS));
    const [game, setGame] = useImmer<GameState>(initialGameState);
    const [player, setPlayer] = useState<Player>(undefined);
    const [error, setError] = useState("");

    /*
     * Fetch game
     */
    const { data, isLoading, isError } = useGameQuery(gamesPlayed, id);

    // Sync local state with server state
    useEffect(() => {
        if (data) {
            setBoard(data.board);
            setGame((draft) => {
                draft.id = data.id;
                draft.winner = data.winner;
                draft.winningPositions = data.winningPositions;
                draft.currentPlayer = data.currentPlayer;
            });
            const playerId = data.players.length === 1 ? 1 : 2;
            setPlayer(playerId);
        }
    }, [data, id, setGame]);

    // Sync local state with socket event i.e other player's move
    useEffect(() => {
        socket.on("connect", () => console.log("Connected to: " + socket.id));
        socket.on("game-updated", (payload: GameState & { board: Board }) => {
            setBoard(payload.board);
            setGame((draft) => {
                draft.currentPlayer = payload.currentPlayer;
                draft.winner = payload.winner;
                draft.winningPositions = payload.winningPositions;
            });
        });

        return () => {
            socket.off("game-updated");
        };
    }, [setGame]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return (
            <p>
                Sorry, something went wrong loading the game. Please try again.
            </p>
        );
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
            const response = await fetch(`${ENDPOINT}/${game.id}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorResponse: { error: string } = await response.json();
                const message = errorResponse.error;
                throw new Error(message);
            }
        } catch (e) {
            setError((e as any).message);
            console.error("Error updating game:", e);
        }
    };

    return (
        <>
            <Dashboard
                game={game}
                player={player}
                isSinglePlayer={isSinglePlayer}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
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

import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import BoardComponent from "./components/Board";
import { useGameQuery } from "./utils/gameQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { io } from "socket.io-client";

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

type Player = 1 | 2 | undefined;
interface GameState {
    id: number;
    currentPlayer: Player;
    winner: Player;
    winningPositions?: Array<[number, number]>;
}
const initialGameState: GameState = {
    id: 1,
    currentPlayer: 1,
    winner: undefined,
};

const socket = io("http://localhost:9001");

function App() {
    const [board, setBoard] = useState<Board>(createBoard(DIMENSIONS));
    const [game, setGame] = useImmer<GameState>(initialGameState);

    /*
     * Fetch our game
     */
    const { data, isLoading, isError, refetch } = useGameQuery({
        id: undefined,
    });
    useEffect(() => {
        if (data) {
            setGame((draft) => {
                draft.id = data.id;
            });
        }
    }, [data?.id]);

    useEffect(() => {
        socket.on("connect", () => console.log(socket.id));
        socket.on("game-updated", (payload) => {
            // setGame(payload);
            console.log(payload);
        });

        return () => {
            socket.off("move");
        };
    }, []);

    if (isLoading) {
        return <h2>Loading...</h2>;
    }
    if (isError) {
        return <h2>Something went wrong!</h2>;
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

        let ENDPOINT = "http://localhost:9000/games";

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

    const resetGame = () => {
        setBoard(createBoard(DIMENSIONS));
        setGame((draft) => {
            draft.currentPlayer = 1;
            draft.winner = undefined;
            draft.winningPositions = undefined;
        });
        refetch();
    };

    return (
        <div className="App">
            <div>
                <h1>Side Stacker</h1>
                {game.winner ? (
                    <>
                        <h1>Game Over! Player {game.winner} wins</h1>
                        <button onClick={resetGame}>Play again?</button>
                    </>
                ) : (
                    <p>It is currently player {game.currentPlayer}'s turn.</p>
                )}
                <BoardComponent
                    board={board}
                    updateBoard={updateGame}
                    winningPositions={game.winningPositions}
                ></BoardComponent>
            </div>
            <ReactQueryDevtools initialIsOpen={true} />
        </div>
    );
}

export default App;

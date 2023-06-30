import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import BoardComponent from "./components/Board";
import { useGameQuery } from "./utils/gameQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
}
const initialGameState: GameState = {
    id: 1,
    currentPlayer: 1,
    winner: undefined,
};

function App() {
    const [board, setBoard] = useState<Board>(createBoard(DIMENSIONS));
    const [game, setGame] = useImmer<GameState>(initialGameState);

    /*
    * Fetch our game
    */
    const { data, isLoading, isError } = useGameQuery({id: undefined});
    useEffect(() => {
      if (data) {
        setGame((draft) => {
          draft.id = data.id;
        });
      }
    }, [data?.id])

    if (isLoading) {
      return <h2>Loading...</h2>
    }
    if (isError) {
      return <h2>Something went wrong!</h2>
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
                draft.winner = updatedGame.winner
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    return (
        <div className="App">
            <div>
                <h1>Side Stacker</h1>
                {game.winner && <h1>Game Over! Player {game.winner} wins</h1>}
                <p>It is currently player {game.currentPlayer}'s turn.</p>
                <BoardComponent
                    board={board}
                    updateBoard={updateGame}
                ></BoardComponent>
            </div>
            <ReactQueryDevtools initialIsOpen={true} />
        </div>
    );
}

export default App;

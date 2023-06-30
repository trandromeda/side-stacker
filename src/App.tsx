import { useEffect } from "react";
import { useImmer } from "use-immer";
import BoardComponent from "./components/Board";
import { checkHasWinner } from "./utils/check-winner";

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

interface GameState {
  playerTurn: 1 | 2;
  isGameOver: boolean;
}
const initialGameState: GameState = {
  playerTurn: 1,
  isGameOver: false,
};

function App() {
  const [board, setBoard] = useImmer<Board>(createBoard(DIMENSIONS));
  const [game, setGame] = useImmer<GameState>(initialGameState);

  const updateGame = ({ row, col }: { row: number; col: number }) => {
    const value = game.playerTurn === 1 ? 1 : -1;
    setBoard((draft) => {
      draft[row][col] = value;
    });
    setGame((draft) => {
      draft.playerTurn = draft.playerTurn === 1 ? 2 : 1;
    });
  };

  useEffect(() => {
    const lastPlayerToken = game.playerTurn === 1 ? -1 : 1;
    const hasWinner = checkHasWinner(board, lastPlayerToken);
    if (hasWinner) {
      console.log("winner winner chicken dinner!");
    }
  }, [board, game.playerTurn]);

  return (
    <div className="App">
      <div>
        <h1>Side Stacker</h1>
        <BoardComponent board={board} updateBoard={updateGame}></BoardComponent>
      </div>
    </div>
  );
}

export default App;

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

type Player = 1 | 2 | undefined;
interface GameState {
  playerTurn: Player;
  winner: Player;
}
const initialGameState: GameState = {
  playerTurn: 1,
  winner: undefined
};

function App() {
  const [board, setBoard] = useImmer<Board>(createBoard(DIMENSIONS));
  const [game, setGame] = useImmer<GameState>(initialGameState);

  const updateGame = ({ row, col }: { row: number; col: number }) => {
    const token = game.playerTurn === 1 ? 1 : -1;
    setBoard((draft) => {
      draft[row][col] = token;
    });

    setGame((draft) => {
      draft.playerTurn = draft.playerTurn === 1 ? 2 : 1;
    });
  };

  useEffect(() => {
    const lastPlayer = game.playerTurn === 1 ? 2 : 1;
    const token = lastPlayer === 1 ? 1 : -1;
    const hasWinner = checkHasWinner(board, token);
    if (hasWinner) {
        setGame((draft) => { 
          draft.winner = lastPlayer
        })
      }
  }, [board, game.playerTurn]);

  return (
    <div className="App">
      <div>
        <h1>Side Stacker</h1>
        {game.winner && <h1>Game Over! Player {game.winner} wins</h1>}
        <p>It is currently player {game.playerTurn}'s turn.</p>
        <BoardComponent board={board} updateBoard={updateGame}></BoardComponent>
      </div>
    </div>
  );
}

export default App;

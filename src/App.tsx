import { useState } from "react";
import { useImmer } from "use-immer";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: spaced-evenly;
  grid-gap: 1em;
  margin: 0 auto;
  max-width: 750px;
`;

type Board = Array<Array<number>>;
const DIMENSIONS = 7;

// create a 7 x 7 two-dimensional array
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

function App() {
  const [board, setBoard] = useImmer<Board>(createBoard(DIMENSIONS));

  const handleClick = (rowIndex: number, direction: "L" | "R") => {
    setBoard((draft) => {
      let left = 0;
      let right = DIMENSIONS - 1;

      while (draft[rowIndex][left] !== 0 && left < DIMENSIONS - 1) {
        left++;
      }

      while (draft[rowIndex][right] !== 0 && right > 0) {
        right--;
      }

      if (direction === "L" && draft[rowIndex][left] === 0) {
        draft[rowIndex][left] = 1;
      } else if (draft[rowIndex][right] === 0) {
        draft[rowIndex][right] = 2;
      }
    });
  };

  return (
    <div className="App">
      <div>
        <h1>Side Stacker</h1>
        {board.map((row, index) => (
          <Row key={index}>
            <button onClick={() => handleClick(index, "L")}>+</button>
            {row.map((column, index) => (
              <div className="column" key={index}>
                {column}
              </div>
            ))}
            <button onClick={() => handleClick(index, "R")}>+</button>
          </Row>
        ))}
      </div>
    </div>
  );
}

export default App;

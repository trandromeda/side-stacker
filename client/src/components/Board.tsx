import styled from "styled-components";

const Row = styled.div`
    display: flex;
    justify-content: space-evenly;
    grid-gap: 1em;
    margin: 0 auto;
    max-width: 500px;
`;

const DIMENSIONS = 7;

interface BoardProps {
    board: Array<Array<number>>;
    updateBoard: ({
        row,
        col,
        direction,
    }: {
        row: number;
        col: number;
        direction: "L" | "R";
    }) => void;
}

function Board({ board, updateBoard }: BoardProps) {
    const handleClick = (rowIndex: number, direction: "L" | "R") => {
        let left = 0;
        let right = DIMENSIONS - 1;

        while (board[rowIndex][left] !== 0 && left < DIMENSIONS - 1) {
            left++;
        }

        while (board[rowIndex][right] !== 0 && right > 0) {
            right--;
        }

        if (direction === "L" && board[rowIndex][left] === 0) {
            updateBoard({
                row: rowIndex,
                col: left,
                direction,
            });
        } else if (board[rowIndex][right] === 0) {
            updateBoard({
                row: rowIndex,
                col: right,
                direction,
            });
        }
    };
    return (
        <div>
            {board.map((row, index) => (
                <Row key={index}>
                    <button onClick={() => handleClick(index, "L")}>+</button>
                    {row.map((column, index) => (
                        <div className="column" key={index}>
                            {column === 1 ? "X" : column === -1 ? "O" : "_"}
                        </div>
                    ))}
                    <button onClick={() => handleClick(index, "R")}>+</button>
                </Row>
            ))}
        </div>
    );
}

export default Board;

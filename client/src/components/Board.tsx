import styled from "styled-components";

const Row = styled.div`
    display: flex;
    justify-content: space-evenly;
    grid-gap: 1em;
    margin: 0 auto;
    max-width: 500px;
`;

const Column = styled.div<{$isWinning?: boolean}>`
color: ${(props) => (props.$isWinning ? "red" : "black")};
font-weight: ${(props) => (props.$isWinning ? 700 : 400)};
`

const DIMENSIONS = 7;

interface BoardProps {
    board: Array<Array<number>>;
    handlePlayerTurn: ({
        row,
        col,
        direction,
    }: {
        row: number;
        col: number;
        direction: "L" | "R";
    }) => void;
    winningPositions?: Array<[number, number]>;
    isCurrentTurn: boolean;
}

function Board({ board, handlePlayerTurn, winningPositions, isCurrentTurn }: BoardProps) {
    const handleClick = (rowIndex: number, direction: "L" | "R") => {
        if (!isCurrentTurn) return;

        let left = 0;
        let right = DIMENSIONS - 1;

        while (board[rowIndex][left] !== 0 && left < DIMENSIONS - 1) {
            left++;
        }

        while (board[rowIndex][right] !== 0 && right > 0) {
            right--;
        }

        if (direction === "L" && board[rowIndex][left] === 0) {
            handlePlayerTurn({
                row: rowIndex,
                col: left,
                direction,
            });
        } else if (board[rowIndex][right] === 0) {
            handlePlayerTurn({
                row: rowIndex,
                col: right,
                direction,
            });
        }
    };
    return (
        <div>
            {board && board.map((row, rowIndex) => (
                <Row key={rowIndex}>
                    <button disabled={!isCurrentTurn} onClick={() => handleClick(rowIndex, "L")}>+</button>
                    {row.map((column, colIndex) => {
                        const isWinning = winningPositions?.some(([row, col]) => row === rowIndex && col === colIndex);
                        return (<Column $isWinning={isWinning} key={colIndex}>
                            {column === 1 ? "X" : column === -1 ? "O" : "_"}
                        </Column>)
                    }
                    )}
                    <button disabled={!isCurrentTurn} onClick={() => handleClick(rowIndex, "R")}>+</button>
                </Row>
            ))}
        </div>
    );
}

export default Board;

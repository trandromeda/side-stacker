import styled from "styled-components";

const BoardComponent = styled.div``;

const Row = styled.div`
    background-color: #495ceb;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 520px;
`;

const Column = styled.div<{
    $isWinning?: boolean;
    $isPlayerOne?: boolean;
    $isPlayerTwo?: boolean;
}>`
    width: 50px;
    height: 50px;
    margin: 5px;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000000;
    font-weight: ${(props) => (props.$isWinning ? 700 : 400)};
    border-radius: 50%;
    background-color: #fff;
    background-color: ${(props) => props.$isPlayerOne && "red"};
    background-color: ${(props) => props.$isPlayerTwo && "yellow"};
    &:after {
        content: ${(props) => (props.$isWinning ? "'V'" : "''")};
        font-size: 16px;
    }
`;

const Button = styled.button<{ $isHidden: boolean }>`
    visibility: ${(props) => (props.$isHidden ? "hidden" : "visible")};
`;

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

function Board({
    board,
    handlePlayerTurn,
    winningPositions,
    isCurrentTurn,
}: BoardProps) {
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
        <BoardComponent>
            {board &&
                board.map((row, rowIndex) => (
                    <Row key={rowIndex}>
                        <Button
                            $isHidden={!isCurrentTurn}
                            onClick={() => handleClick(rowIndex, "L")}
                        >
                            +
                        </Button>
                        {row.map((column, colIndex) => {
                            const isWinning = winningPositions?.some(
                                ([row, col]) =>
                                    row === rowIndex && col === colIndex
                            );
                            return (
                                <Column
                                    $isWinning={isWinning}
                                    $isPlayerOne={column === 1}
                                    $isPlayerTwo={column === -1}
                                    key={colIndex}
                                ></Column>
                            );
                        })}
                        <Button
                            $isHidden={!isCurrentTurn}
                            onClick={() => handleClick(rowIndex, "R")}
                        >
                            +
                        </Button>
                    </Row>
                ))}
        </BoardComponent>
    );
}

export default Board;

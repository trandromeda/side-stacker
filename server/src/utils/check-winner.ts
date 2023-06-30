function checkRow(board: number[][], token: number): [boolean, number[][]] {
    for (let i = 0; i < board.length; i++) {
        let count = 0;
        let positions = [];
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === token) {
                count++;
                positions.push([i, j]);
                if (count === 4) return [true, positions];
            } else {
                count = 0;
                positions = [];
            }
        }
    }
    return [false, []];
}

function checkColumn(board: number[][], token: number): [boolean, number[][]] {
    for (let i = 0; i < board[0].length; i++) {
        let count = 0;
        let positions = [];
        for (let j = 0; j < board.length; j++) {
            if (board[j][i] === token) {
                count++;
                positions.push([j, i]);
                if (count === 4) return [true, positions];
            } else {
                count = 0;
                positions = [];
            }
        }
    }
    return [false, []];
}

function checkDiagonal(board: number[][], token: number): [boolean, number[][]] {
    let N = board.length;
    let M = board[0].length;

    // check "/" diagonal
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            if (
                i + 3 < N &&
                j + 3 < M &&
                board[i][j] === token &&
                board[i + 1][j + 1] === token &&
                board[i + 2][j + 2] === token &&
                board[i + 3][j + 3] === token
            ) {
                const positions = [
                    [i, j],
                    [i + 1, j + 1],
                    [i + 2, j + 2],
                    [i + 3, j + 3],
                ];
                return [true, positions];
            }
        }
    }

    // check "\" diagonal
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            if (
                i + 3 < N &&
                j - 3 >= 0 &&
                board[i][j] === token &&
                board[i + 1][j - 1] === token &&
                board[i + 2][j - 2] === token &&
                board[i + 3][j - 3] === token
            ) {
                const positions = [
                    [i, j],
                    [i + 1, j - 1],
                    [i + 2, j - 2],
                    [i + 3, j - 3],
                ];
                return [true, positions];
            }
        }
    }

    return [false, []];
}

function checkHasWinner(board: Array<Array<number>>, player: number) {
    const rowResult = checkRow(board, player);
    const columnResult = checkColumn(board, player);
    const diagonalResult = checkDiagonal(board, player);

    if (rowResult[0]) {
        return rowResult[1];
    } else if (columnResult[0]) {
        return columnResult[1];
    } else if (diagonalResult[0]) {
        return diagonalResult[1];
    } else {
        return [];
    }
}

export default checkHasWinner;

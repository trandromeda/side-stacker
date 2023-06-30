function checkRow(board: number[][], token: number): boolean {
  for (let i = 0; i < board.length; i++) {
    let count = 0;
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === token) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
  }
  return false;
}

function checkColumn(board: number[][], token: number): boolean {
  for (let i = 0; i < board[0].length; i++) {
    let count = 0;
    for (let j = 0; j < board.length; j++) {
      if (board[j][i] === token) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
  }
  return false;
}

function checkDiagonal(board: number[][], token: number): boolean {
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
      )
        return true;
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
      )
        return true;
    }
  }

  return false;
}

function checkHasWinner(board: Array<Array<number>>, player: number): boolean {
  return (
    checkRow(board, player) ||
    checkColumn(board, player) ||
    checkDiagonal(board, player)
  );
}

export { checkHasWinner };

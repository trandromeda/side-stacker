import  checkWinner from '../utils/check-winner';

describe('Check winning conditions', () => {
    // let player: number;

    // beforeEach(() => {
    //     player = 1;
    // })

    it('Correctly returns winning positions in a column', () => {
        let player = 1;
        let board = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ]

        const winningPositions = checkWinner(board, player);
        expect(winningPositions).toEqual([[2,0], [3,0], [4,0], [5,0]]);
    })
})
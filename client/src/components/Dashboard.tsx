import { GameState } from "../types/game.types";

interface DashboardProps {
    game: GameState;
}

function Dashboard({game}: DashboardProps) {
    return (
        <>
        <h3>Room: {game.id}</h3>

                {game.winner ? (
                    <>
                        <h1>Game Over! Player {game.winner} wins</h1>
                    </>
                ) : (
                    <p>It is currently player {game.currentPlayer}'s turn.</p>
                )}
        </>
    )
}

export default Dashboard
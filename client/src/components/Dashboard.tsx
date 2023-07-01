import { GameState, Player } from "../types/game.types";

interface DashboardProps {
    game: GameState;
    player: Player;
}

function Dashboard({ game, player }: DashboardProps) {
    return (
        <>
            <h3>Room: {game.id}</h3>

            {game.winner ? (
                <>
                    <h1>Game Over! Player {game.winner} wins</h1>
                </>
            ) : (
                <div>
                    <p>You are player {player}.</p>
                    <p>It is currently player {game.currentPlayer}'s turn.</p>
                </div>
            )}
        </>
    );
}

export default Dashboard;

import { GameState, Player } from "../types/game.types";

interface DashboardProps {
    game: GameState;
    player: Player;
    isSinglePlayer: boolean;
}

function Dashboard({ game, player, isSinglePlayer }: DashboardProps) {
    return (
        <>
            <h3>Room: {game.id}</h3>

            {game.winner ? (
                <>
                    <h1>Game Over! Player {game.winner} wins</h1>
                </>
            ) : (
                <div>
                    {!isSinglePlayer && <p>You are player {player}.</p>}
                    <p>It is currently player {game.currentPlayer}'s turn.</p>
                </div>
            )}
        </>
    );
}

export default Dashboard;

import { GameState, Player } from "../types/game.types";
import styled from "styled-components";

const Wrapper = styled.div`
    text-align: center;
`;

const Message = styled.h1``;

interface DashboardProps {
    game: GameState;
    player: Player;
    isSinglePlayer: boolean;
}

function Dashboard({ game, player, isSinglePlayer }: DashboardProps) {
    return (
        <>
            <p>Game ID: {game.id}</p>
            <Wrapper>
                {game.winner ? (
                    <>
                        <Message>Game Over! Player {game.winner} wins</Message>
                    </>
                ) : (
                    <div>
                        {!isSinglePlayer && <p>You are player {player}.</p>}
                        <p>
                            It is currently player {game.currentPlayer}'s turn.
                        </p>
                    </div>
                )}
            </Wrapper>
        </>
    );
}

export default Dashboard;

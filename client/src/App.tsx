import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import styled from "styled-components";
import Game from "./components/Game";

const Wrapper = styled.div`
    padding: 2em;
`;

const Title = styled.h1`
    text-align: center;
`;

const Options = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    grid-gap: 0.5em;
`;

function App() {
    const [gameId, setGameId] = useState<number | undefined>(undefined);
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [gamesPlayed, setGamesPlayed] = useState<number>(0);
    const [isSinglePlayer, setIsSinglePlayer] = useState(false);

    const handleNewGame = () => {
        setGameId(undefined);
        setGamesPlayed((gp) => gp + 1);
        setHasStarted(true);
    };

    const handleJoinGame = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = (event.target as HTMLFormElement).room.value;
        setGameId(Number(id));
        setHasStarted(true);
    };

    return (
        <Wrapper>
            <Title>Totally-Not-Connect-Four</Title>
            <Options>
                <button onClick={handleNewGame}>New game</button>

                <form onSubmit={(event) => handleJoinGame(event)}>
                    <input type="text" id="room" placeholder="Enter ID"></input>
                    <button type="submit">Join game</button>
                </form>

                {!hasStarted && (
                    <label>
                        <input
                            type="checkbox"
                            checked={isSinglePlayer}
                            onChange={() => setIsSinglePlayer(!isSinglePlayer)}
                        />
                        Single player mode
                    </label>
                )}
            </Options>
            {hasStarted && (
                <Game
                    id={gameId}
                    gamesPlayed={gamesPlayed}
                    isSinglePlayer={isSinglePlayer}
                />
            )}
            <ReactQueryDevtools initialIsOpen={true} />
        </Wrapper>
    );
}

export default App;

import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Game from "./components/Game";

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
        <div>
            <h1>Side Stacker</h1>
            <div>
                <button onClick={handleNewGame}>New game</button>

                <form onSubmit={(event) => handleJoinGame(event)}>
                    <input type="text" id="room"></input>
                    <button type="submit">Join game</button>
                </form>

                <label>
                    <input
                        type="checkbox"
                        checked={isSinglePlayer}
                        onChange={() => setIsSinglePlayer(!isSinglePlayer)}
                    />
                    Single player mode
                </label>
            </div>
            {hasStarted && <Game id={gameId} gamesPlayed={gamesPlayed} isSinglePlayer={isSinglePlayer} />}
            <ReactQueryDevtools initialIsOpen={true} />
        </div>
    );
}

export default App;

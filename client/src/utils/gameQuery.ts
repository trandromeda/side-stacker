import { useQuery } from "@tanstack/react-query";
import { Board, GameState } from "../types/game.types";

export const ENDPOINT = "http://localhost:9000/games";

/**
 * Query for creating a new game or retrieving an existing game. 
 */
export function useGameQuery(gamesPlayed: number, id?: number) {
    let METHOD = "POST";
    let ENDPOINT_QUERY = ENDPOINT;
    if (id) {
        ENDPOINT_QUERY += `/${id}`;
        METHOD = "GET";
    }

    const fetchGame = (): Promise<GameState & { board: Board }> =>
        fetch(ENDPOINT_QUERY, {
            method: METHOD,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res?.ok) {
                return res.json();
            } else {
                throw new Error(
                    "Uh oh, something went wrong. Please try again."
                );
            }
        });

    return useQuery({
        queryKey: ["game", id, gamesPlayed],
        queryFn: fetchGame,
        staleTime: 1000 * 60 * 5, // match default of cacheTime
    });
}

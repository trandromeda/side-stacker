import { useQuery } from "@tanstack/react-query";

export let ENDPOINT = "http://localhost:9000/games";

export function useGameQuery(gamesPlayed: number, id?: number) {
    let METHOD = "POST";
    if (id) {
        ENDPOINT += `/${id}`;
        METHOD = "GET";
    }

    return useQuery({
        queryKey: [
            "game", id, gamesPlayed
        ],
        queryFn: () =>
            fetch(ENDPOINT, {
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
            }),
        staleTime: 1000 * 60 * 5, // match default of cacheTime
    });
}

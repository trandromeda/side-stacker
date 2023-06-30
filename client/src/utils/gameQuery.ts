import { useQuery } from "@tanstack/react-query";

interface GameQueryParams {
    id?: number;
}

export function useGameQuery({id}: GameQueryParams) {
    let ENDPOINT = "http://localhost:9000/games";

    return useQuery({
        queryKey: [
            "game",
            {
                id,
            },
        ],
        queryFn: () =>
            fetch(ENDPOINT, {
                method: "POST",
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

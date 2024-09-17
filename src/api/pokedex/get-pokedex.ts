import { queryOptions } from "@tanstack/react-query";

async function fetchDex(signal: AbortSignal): Promise<number[]> {
  const result = await fetch("http://localhost:3000/api/pokedex", {
    signal,
  });
  return result.json();
}

export const getPokedexQueryOptions = () =>
  queryOptions({
    queryKey: ["pokedex"],
    queryFn: ({ signal }) => fetchDex(signal),
  });

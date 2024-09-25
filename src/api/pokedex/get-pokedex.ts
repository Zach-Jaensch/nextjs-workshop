import { queryOptions } from "@tanstack/react-query";

export async function fetchDex(): Promise<number[]> {
  const result = await fetch("http://localhost:3000/api/pokedex");
  return result.json();
}

export const getPokedexQueryOptions = () =>
  queryOptions({
    queryKey: ["pokedex"],
    queryFn: () => fetchDex(),
  });

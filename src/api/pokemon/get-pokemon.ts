import { queryOptions } from "@tanstack/react-query";

interface Pokemon {
  id: number;
  name: string;
  picture: string;
  types: string[];
  height: number;
  weight: number;
}

async function fetchPokemon(signal: AbortSignal, id: number): Promise<Pokemon> {
  const result = await fetch(`http://localhost:3000/api/pokemon/${id}`, {
    signal,
  });
  return result.json();
}

export const getPokemonQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["pokemon", id],
    queryFn: ({ signal }) => fetchPokemon(signal, id),
  });

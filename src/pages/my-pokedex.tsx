import { PokemonCard } from "#/components/pokemon-card";
import { useQuery } from "@tanstack/react-query";

async function fetchDex(signal: AbortSignal) {
  const result = await fetch("/api/pokedex/", {
    signal,
  });
  return result.json();
}

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["pokedex"],
    queryFn: ({ signal }) => fetchDex(signal),
  });

  if (isLoading) {
    return <div>Loading Pokédex...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 grid gap-4 grid-cols-12">
      {data.map((index: number) => (
        <PokemonCard id={index + 1} key={index} isInDex />
      ))}
    </div>
  );
}

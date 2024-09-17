import { getPokedexQueryOptions } from "#/api/pokedex/get-pokedex";
import { PokemonCard } from "#/components/pokemon-card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data = [], isLoading } = useQuery(getPokedexQueryOptions());

  if (isLoading) {
    return <div>Loading Pokédex...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 grid gap-4 grid-cols-12">
      {data.map((index: number) => (
        <PokemonCard id={index} key={index} isInDex />
      ))}
    </div>
  );
}

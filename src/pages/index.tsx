import { PokemonCard } from "#/components/pokemon-card";
import { useQuery } from "@tanstack/react-query";
import { getPokedexQueryOptions } from "#/api/pokedex/get-pokedex";

export default function Home() {
  const { data = [], isLoading } = useQuery(getPokedexQueryOptions());

  if (isLoading) {
    return <div>Loading Pokédex...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 grid gap-4 grid-cols-12">
      {Array.from({ length: 50 }).map((_, index) => (
        <PokemonCard
          id={index + 1}
          key={index}
          isInDex={data.includes(index + 1)}
        />
      ))}
    </div>
  );
}

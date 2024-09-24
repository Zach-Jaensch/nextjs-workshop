"use client";

import { getPokedexQueryOptions } from "#/api/pokedex/get-pokedex";

import { PokemonCard } from "#/components/pokemon-card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data = [], isLoading } = useQuery(getPokedexQueryOptions());

  if (isLoading) {
    return <div>Loading Pokédex...</div>;
  }

  return (
    <div className="container mx-auto grid w-full grid-cols-1 gap-8 px-4 py-8 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {data.map((index: number) => (
        <PokemonCard id={index} key={index} isInDex />
      ))}
    </div>
  );
}

import { fetchDex } from "#/api/pokedex/get-pokedex";

import { PokemonCard } from "#/components/pokemon-card";

export default async function Home() {
  const dex = await fetchDex();

  return (
    <div className="container mx-auto grid w-full grid-cols-1 gap-8 px-4 py-8 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {dex.map((index: number) => (
        <PokemonCard id={index} key={index} isInDex />
      ))}
    </div>
  );
}

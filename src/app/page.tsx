import { PokemonCard } from "#/components/pokemon-card";
import { fetchDex } from "#/api/pokedex/get-pokedex";

export default async function Home() {
  const dex = await fetchDex();

  return (
    <div className="container mx-auto grid w-full grid-cols-1 gap-8 px-4 py-8 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 50 }).map((_, index) => (
        <PokemonCard
          id={index + 1}
          key={index}
          isInDex={dex.includes(index + 1)}
        />
      ))}
    </div>
  );
}

import { PokemonCard } from "#/components/pokemon-card";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getPokemonQueryOptions } from "#/api/pokemon/get-pokemon";
import { getPokedexQueryOptions } from "#/api/pokedex/get-pokedex";

export default function Home() {
  const { data = [], isLoading } = useQuery(getPokedexQueryOptions());

  if (isLoading) {
    return <div>Loading Pokédex...</div>;
  }

  return (
    <div className="container mx-auto grid w-full grid-cols-1 gap-8 px-4 py-8 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(getPokedexQueryOptions()),
    ...Array.from({ length: 50 }).map((_, index) =>
      queryClient.prefetchQuery(getPokemonQueryOptions(index)),
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

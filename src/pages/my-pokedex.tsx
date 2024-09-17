import { getPokedexQueryOptions } from "#/api/pokedex/get-pokedex";
import { getPokemonQueryOptions } from "#/api/pokemon/get-pokemon";
import { PokemonCard } from "#/components/pokemon-card";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

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

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  const dex = await queryClient.fetchQuery(getPokedexQueryOptions());

  await Promise.all(
    dex.map((index) =>
      queryClient.prefetchQuery(getPokemonQueryOptions(index)),
    ),
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

import { getPokemonQueryOptions } from "#/api/pokemon/get-pokemon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

async function addToDex(pokemonId: number) {
  const result = await fetch("/api/pokedex", {
    method: "POST",
    body: JSON.stringify(pokemonId),
  });
  return result.json();
}

async function removeFromDex(pokemonId: number) {
  const result = await fetch("/api/pokedex", {
    method: "DELETE",
    body: JSON.stringify(pokemonId),
  });
  return result.json();
}

interface PokemonCardProps {
  id: number;
  isInDex: boolean;
}

export function PokemonCard({ id, isInDex }: PokemonCardProps) {
  const { data, isLoading } = useQuery(getPokemonQueryOptions(id));

  const queryClient = useQueryClient();

  const { mutate: add, isPending: isAdding } = useMutation({
    mutationFn: addToDex,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokedex"] });
    },
  });

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: removeFromDex,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokedex"] });
    },
  });

  if (isLoading || !data) {
    return <div>Loading Pokémon...</div>;
  }

  return (
    <div className="flex flex-col border-spacing-1 border-black border rounded p-4 lg:col-span-2 sm:col-span-4 col-span-6 gap-4">
      <div className="border-spacing-1 border-black border rounded relative">
        <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 absolute top-2 right-2">
          {id}
        </div>
        <Image
          className="mx-auto"
          src={data.picture}
          alt={data.name}
          width={16 * 10}
          height={16 * 10}
        />
      </div>
      <h2 className="text-xl text-bold">{data.name}</h2>
      <dl className="grid grid-cols-2">
        <dt>Types:</dt>
        <div>
          {data.types.map((type: string) => (
            <dd key={type}>{type}</dd>
          ))}
        </div>
        <dt>Height:</dt>
        <dd>{data.height}</dd>
        <dt>Weight:</dt>
        <dd>{data.weight}</dd>
      </dl>
      <button
        className={`
          rounded-md
        ${isInDex ? "bg-red-600" : "bg-indigo-600"}
          disabled:opacity-50
          px-3
          py-2
          text-sm
          font-semibold
          text-white
          shadow-sm
          ${isInDex ? "hover:bg-red-500" : "hover:bg-indigo-500"}
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          ${
            isInDex ? "focus-visible:bg-red-600" : "focus-visible:bg-indigo-600"
          }
          mt-auto
        `}
        disabled={isAdding || isRemoving}
        onClick={() => (isInDex ? remove(data.id) : add(data.id))}
      >
        {isInDex ? "Remove from" : "Add to"} Pokédex
      </button>
    </div>
  );
}

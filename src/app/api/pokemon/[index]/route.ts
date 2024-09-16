import { NextRequest } from "next/server";

interface PokeApiPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
}

interface Context {
  params: {
    index: string;
  };
}

export async function GET(request: NextRequest, context: Context) {
  const result = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${context.params.index}`
  );
  const pokemon = (await result.json()) as PokeApiPokemon;

  const fieldsToReturn = {
    id: pokemon.id,
    name: pokemon.name,
    picture: pokemon.sprites.front_default,
    types: pokemon.types.map(({ type }) => type.name),
    height: pokemon.height,
    weight: pokemon.weight,
  };

  return new Response(JSON.stringify(fieldsToReturn));
}

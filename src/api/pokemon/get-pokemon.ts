interface Pokemon {
  id: number;
  name: string;
  picture: string;
  types: string[];
  height: number;
  weight: number;
}

export async function fetchPokemon(id: number): Promise<Pokemon> {
  const result = await fetch(`http://localhost:3000/api/pokemon/${id}`);
  return result.json();
}

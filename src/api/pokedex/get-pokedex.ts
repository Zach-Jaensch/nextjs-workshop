export async function fetchDex(): Promise<number[]> {
  const result = await fetch("http://localhost:3000/api/pokedex");
  return result.json();
}

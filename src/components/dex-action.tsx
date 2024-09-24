"use client";

import { Button } from "#/components/ui/button";
import { useRouter } from "next/navigation";
import { useOptimistic } from "react";

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

interface DexActionProps {
  isInDex: boolean;
  id: number;
}

export function DexAction({ isInDex, id }: DexActionProps) {
  const router = useRouter();
  const [optimisticIsInDex, updateOptimisticIsInDex] = useOptimistic(isInDex);

  function handleClick() {
    optimisticIsInDex ? removeFromDex(id) : addToDex(id);
    updateOptimisticIsInDex((prev) => !prev);
    router.refresh();
  }

  return (
    <Button
      // disabled={isAdding || isRemoving}
      className="w-full"
      variant={optimisticIsInDex ? "destructive" : "default"}
      onClick={handleClick}
    >
      {optimisticIsInDex ? "Remove from" : "Add to"} Pokédex
    </Button>
  );
}

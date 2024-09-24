"use client";

import { Button } from "#/components/ui/button";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

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

  const [_, formAction, isPending] = useActionState(
    async function handleClick() {
      isInDex ? await removeFromDex(id) : await addToDex(id);
      router.refresh();
    },
    undefined,
  );

  return (
    <form action={formAction} className="mt-auto grid">
      <Button
        disabled={isPending}
        className="w-full"
        variant={isInDex ? "destructive" : "default"}
        type="submit"
      >
        {isInDex ? "Remove from" : "Add to"} Pokédex
      </Button>
    </form>
  );
}

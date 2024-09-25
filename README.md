# Nextjs App router workshop

A Quick run through on how to migrate a client side app, first to use server side rendering, then incremental static regeneration, and finally, migrate to use server components.

## Prerequisites

Before the workshop, ensure that you have [nvm](https://github.com/nvm-sh/nvm) (or [fnm](https://github.com/Schniz/fnm)) is installed.

Optionally, if you want to deploy your application, set up a Vercel account:

1. https://vercel.com/signup
1. Select "Hobby"
1. Enter your name and press continue
1. Continue with GitHub

## Getting started

1. Select the right node version (or install it)

   ```bash
   nvm use
   ```

1. Install the correct version of pnpm

   ```bash
   corepack enable
   ```

1. Install dependencies

   ```bash
   pnpm install
   ```

1. Run app

   ```bash
   pnpm dev
   ```

## Tasks

Before starting, run the app and have a play around.
Look at the root page and the my-pokedex page.
Note the loading states and what happens when you add and remove pokemon from your pokedex.

### Implement server side rendering

Got to `src/pages/_app.tsx`
Create PageProps and use as generic for AppProps

```tsx
import type { DehydratedState } from "@tanstack/react-query";
export interface PageProps {
  dehydratedState: DehydratedState;
}
export default function App({
  Component,
  pageProps: { dehydratedState, ...pageProps },
}: AppProps<PageProps>);
```

Add HydrationBoundary from RQ just inside QueryClientProvider

```tsx
import { HydrationBoundary } from "@tanstack/react-query";

// ...

export default function App({
  Component,
  pageProps: { dehydratedState, ...pageProps },
}: AppProps<PageProps>) {
  // ...

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {/* Keep the remaining content */}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
```

Ensure state for HydrationBoundary comes from pageprops

Go to `src/pages/index.tsx`
Add in the getServerSideProps snippet

```tsx
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getPokemonQueryOptions } from "#/api/pokemon/get-pokemon";

// ...

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
```

Running the app, you will notice that individual Pokemon are now loading at page level

Go to pages/my-pokedex.tsx
Add in the getServerSideProps snippet

```tsx
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getPokemonQueryOptions } from "#/api/pokemon/get-pokemon";

// ...

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
```

### Migrate to app router

> Kill the dev server due to upcoming breaking changes

Create a new app router root layout `src/app/layout.tsx`
Use new ReactQuery and Header component (these already exist for you in `src/app/_components`) and build the document

```tsx
import type { AppProps } from "next/app";
import "#/styles/globals.css";
import { ReactQuery } from "./_components/react-query";
import { Header } from "./_components/header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>My Pokémon</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Header />
        <main>
          <ReactQuery>{children}</ReactQuery>
        </main>
      </body>
    </html>
  );
}
```

> Look at the differences between the App router layout and Pages router \_app.tsx

Move `src/pages/index.tsx` to `src/app/page.tsx`
Move `src/pages/my-pokedex.tsx` to `src/app/my-pokedex/page.tsx`
Add the `"use client"` directive and remove the `getServerSideProps` function from each

```tsx
"use client"; // <- Add this

import { foo } from "bar";

// ...

export const getServerSideProps: GetServerSideProps = async () => {
  // !! Delete me !!
};
```

> Play with app, note loading state is back

> Dehydrated state in app router is possible, but outside the scope of this workshop

### Update to server components

> Kill the dev server due to upcoming breaking changes

Add “use client” directive to `src/components/pokemon-card.tsx`

```tsx
"use client"; // <- Add this

import { foo } from "bar";
```

Replace useQuery in `src/app/page.tsx` and `src/app/my-pokedex/page.tsx` with fetch functions

```diff
- "use client";

- import { PokemonCard } from "#/components/pokemon-card";
- import { useQuery } from "@tanstack/react-query";
- import { getPokedexQueryOptions } from "#/api/pokedex/get-pokedex";
+ import { fetchDex } from "#/api/pokedex/get-pokedex";

- export default function Home() {
+ export default async function Home() {

- const { data = [], isLoading } = useQuery(getPokedexQueryOptions());
- if (isLoading) {
-   return <div>Loading Pokédex...</div>;
- }
+ const data = await fetchDex();
```

> Play in app NOTE: UI does not update

Replace updaters with next refresh

```diff
- import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
+ import { useMutation, useQuery } from "@tanstack/react-query";
+ import { useRouter } from "next/navigation";

- const queryClient = useQueryClient();

- queryClient.invalidateQueries({ queryKey: ["pokedex"] });
+ router.refresh();
```

> Play in app NOTE: UI is updating, but is slow

Update `src/components/pokemon-card.tsx` to be a server component
Move all code related to the button (including the add and remove handlers) to a new client component

```diff
- "use client";

// ...

- const queryClient = useQueryClient();
- const { mutate: add, isPending: isAdding } = useMutation({
-   mutationFn: addToDex,
-   onSuccess: () => {
-     router.refresh();
-   },
- });
- const { mutate: remove, isPending: isRemoving } = useMutation({
-   mutationFn: removeFromDex,
-   onSuccess: () => {
-     router.refresh();
-   },
- });


<CardFooter className="p-4 pt-0">
-  <Button
-     disabled={isAdding || isRemoving}
-     className="w-full"
-     variant={isInDex ? "destructive" : "default"}
-     onClick={() => (isInDex ? remove(data.id) : add(data.id))}
-  >
-     {isInDex ? "Remove from" : "Add to"} Pokédex
-  </Button>
+  <DexAction isInDex={isInDex} id={data.id} />
</CardFooter>
```

Replace `useMutation` implementation with direct calls to the fetch functions and add optimistic updates
Comment out the loading state `disable` for now. We will come back to this later

```diff
export function DexAction({ isInDex, id }: DexActionProps) {
  const router = useRouter();

+ const [optimisticIsInDex, updateOptimisticIsInDex] = useOptimistic(isInDex);
+ function handleClick() {
+   optimisticIsInDex ? removeFromDex(id) : addToDex(id);
+   updateOptimisticIsInDex((prev) => !prev);
+   router.refresh();
+ }




   <Button
-     disabled={isAdding || isRemoving}
-     variant={isInDex ? "destructive" : "default"}
-     onClick={() => (isInDex ? remove(data.id) : add(data.id))}
+     // disabled={isAdding || isRemoving}
+     variant={optimisticIsInDex ? "destructive" : "default"}
+     onClick={handleClick}
   >
-     {isInDex ? "Remove from" : "Add to"} Pokédex
+     {optimisticIsInDex ? "Remove from" : "Add to"} Pokédex
   </Button>

```

OPTIONAL: Delete react-query usages and uninstall

> Play in app NOTE: everything kinda works, but can be buggy

### Optimisations

`useActionState` in card button instead of `useOptimistic`

```diff
export function DexAction({ isInDex, id }: DexActionProps) {
  const router = useRouter();

- const [optimisticIsInDex, updateOptimisticIsInDex] = useOptimistic(isInDex);
- function handleClick() {
-   optimisticIsInDex ? removeFromDex(id) : addToDex(id);
-   updateOptimisticIsInDex((prev) => !prev);
-   router.refresh();
- }
+ const [_, formAction, isPending] = useActionState(
+   async function handleClick() {
+     isInDex ? await removeFromDex(id) : await addToDex(id);
+     router.refresh();
+   },
+   undefined,
+ );



+ <form action={formAction} className="mt-auto grid">
   <Button
-     // disabled={isAdding || isRemoving}
-     variant={optimisticIsInDex ? "destructive" : "default"}
-     onClick={handleClick}
+     disabled={isPending}
+     variant={isInDex ? "destructive" : "default"}
+     type="submit"
   >
-     {optimisticIsInDex ? "Remove from" : "Add to"} Pokédex
+     {isInDex ? "Remove from" : "Add to"} Pokédex
   </Button>
+ </form>
```

Next cache on poke card

```diff
+ import { unstable_cache } from "next/cache";
+ const getCachedPokemon = unstable_cache(
+   async (id) => fetchPokemon(id),
+   ["pokemon"],
+ );

export async function PokemonCard({ id, isInDex }: PokemonCardProps) {
-  const data = await fetchPokemon(id);
+  const data = await getCachedPokemon(id);
```

Add a root loading component at `src/app/loading.tsx`

```tsx
export default function Loading() {
  return <>Loading</>;
}
```

## Stretch goals

### Implement a loading page

https://nextjs.org/docs/app/api-reference/file-conventions/loading

### Migrate form action to a server form action

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

import { useState } from "react";
import type { AppProps } from "next/app";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "#/components/ui/navigation-menu";
import "#/styles/globals.css";
import type { DehydratedState } from "@tanstack/react-query";
export interface PageProps {
  dehydratedState: DehydratedState;
}

export default function App({
  Component,
  pageProps: { dehydratedState, ...pageProps },
}: AppProps<PageProps>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const isPokedex = pathname === "/my-pokedex";

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <NavigationMenu className="p-2">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    className: isPokedex ? "font-normal" : "font-semibold",
                  })}
                >
                  All pokémon
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/my-pokedex" legacyBehavior passHref>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    className: isPokedex ? "font-semibold" : "font-normal",
                  })}
                >
                  My pokédex
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

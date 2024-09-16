import "#/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const currentTabStyle =
  "inline-block p-4  border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";
const tabStyle =
  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
      <nav className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px gap-2">
          <li>
            <Link
              href="/"
              className={pathname === "/" ? currentTabStyle : tabStyle}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              All pokémon
            </Link>
          </li>
          <li>
            <Link
              href="/my-pokedex"
              className={
                pathname === "/my-pokedex" ? currentTabStyle : tabStyle
              }
              aria-current={pathname === "/my-pokedex" ? "page" : undefined}
            >
              My pokédex
            </Link>
          </li>
        </ul>
      </nav>

      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

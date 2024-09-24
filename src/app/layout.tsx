import type { AppProps } from "next/app";
import "#/styles/globals.css";
import type { DehydratedState } from "@tanstack/react-query";
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

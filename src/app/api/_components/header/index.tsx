"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "#/components/ui/navigation-menu";

export function Header() {
  const pathname = usePathname();
  const isPokedex = pathname === "/my-pokedex";

  return (
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
  );
}

import Image from "next/image";
import { fetchPokemon } from "#/api/pokemon/get-pokemon";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { capitalizeFirstLetter } from "#/lib/utils";
import { BugSvg } from "./svgs/bug";
import { ElectricSvg } from "./svgs/electric";
import { FairySvg } from "./svgs/fairy";
import { FireSvg } from "./svgs/fire";
import { FlyingSvg } from "./svgs/flying";
import { GrassSvg } from "./svgs/grass";
import { GroundSvg } from "./svgs/ground";
import { NormalSvg } from "./svgs/normal";
import { PoisonSvg } from "./svgs/poison";
import { WaterSvg } from "./svgs/water";
import { DexAction } from "./dex-action";

interface BadgeWithIconProps {
  type: string;
}

function BadgeWithIcon({ type }: BadgeWithIconProps) {
  const Icon = (() => {
    switch (type) {
      case "bug":
        return BugSvg;
      case "electric":
        return ElectricSvg;
      case "fairy":
        return FairySvg;
      case "fire":
        return FireSvg;
      case "flying":
        return FlyingSvg;
      case "grass":
        return GrassSvg;
      case "ground":
        return GroundSvg;
      case "normal":
        return NormalSvg;
      case "poison":
        return PoisonSvg;
      case "water":
        return WaterSvg;
      default:
        throw new Error(`Missing icon for type: ${type}`);
    }
  })();
  return (
    <Badge variant="secondary" key={type} className="flex gap-1">
      <Icon height="0.75rem" />
      {capitalizeFirstLetter(type)}
    </Badge>
  );
}

interface PokemonCardProps {
  id: number;
  isInDex: boolean;
}

export async function PokemonCard({ id, isInDex }: PokemonCardProps) {
  const data = await fetchPokemon(id);

  const name = capitalizeFirstLetter(data.name);

  return (
    <Card className="relative mx-auto w-full overflow-hidden">
      <CardHeader className="flex items-center justify-center bg-secondary p-2">
        <span className="border-secondary/-5 absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-white p-2 text-xs font-bold">
          {id}
        </span>
        <Image
          src={data.picture}
          alt={name}
          width={160}
          height={160}
          className="object-contain"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4">
        <h2 className="text-2xl font-bold">{name}</h2>
        <div className="flex flex-wrap gap-2">
          {data.types.map((type: string) => (
            <BadgeWithIcon key={type} type={type} />
          ))}
        </div>
        <div className="flex flex-col text-sm">
          <div>
            <span className="font-semibold">Height:</span> {data.height} m
          </div>
          <div>
            <span className="font-semibold">Weight:</span> {data.weight} kg
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <DexAction isInDex={isInDex} id={data.id} />
      </CardFooter>
    </Card>
  );
}

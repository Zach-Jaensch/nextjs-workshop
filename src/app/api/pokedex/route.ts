import { NextRequest } from "next/server";

type Dex = string[];

const dex: Dex = [];

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(dex));
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  dex.push(data);
  return new Response(JSON.stringify(dex));
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  dex.splice(dex.indexOf(data), 1);
  return new Response(JSON.stringify(dex));
}

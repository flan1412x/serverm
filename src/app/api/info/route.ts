import { NextResponse } from "next/server";

export async function GET() {
  
  const info = {
    version: 1.0,
    prioridad: 1
  };

  return NextResponse.json(info);

  
}


import { NextResponse } from "next/server";

export async function GET() {
   console.log("Conectado al middleware")
  const info = {
    version: 1.0,
    prioridad: 1
  };

  return NextResponse.json(info);

  
}


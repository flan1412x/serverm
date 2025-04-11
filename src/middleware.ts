import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obtener el user-agent
  const userAgent = request.headers.get("user-agent") || ""

  // Verificar si es una solicitud de API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Agregar el user-agent a los headers para que las rutas API puedan verificarlo
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-middleware-user-agent", userAgent)

    // Continuar con la solicitud, pero con los headers modificados
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Para otras rutas, simplemente continuar
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Aplicar el middleware a todas las rutas de API
    "/api/:path*",
  ],
}

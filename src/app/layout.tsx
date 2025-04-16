import type React from "react"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

import { MantineProvider, ColorSchemeScript } from "@mantine/core"
import { Notifications } from "@mantine/notifications"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es"
    data-mantine-color-scheme="light">
      
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>Gestión de Estudiantes</title>
      </head>
      <body>
        <MantineProvider>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}


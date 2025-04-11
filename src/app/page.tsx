// app/page.tsx

"use client"

import { Card, Text, Title, Stack, Button } from "@mantine/core"
import { IconSchool, IconInfoCircle } from "@tabler/icons-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <Stack align="center" justify="center" h="100%" gap="xl">

      {/* Primer Card */}
      <Card shadow="md" padding="xl" radius="md" withBorder maw={600}>
        <Stack align="center" gap="md">
          <IconSchool size={60} color="#1c7ed6" />
          <Title order={2} ta="center">
            Bienvenido al Sistema de Gestión Académica
          </Title>
          <Text ta="center" size="lg" color="dimmed">
            Usa el menú lateral para navegar entre estudiantes, profesores,
            asignaturas, ciclos y matrículas.
          </Text>
        </Stack>
      </Card>

      {/* Segundo Card con información y botones de navegación */}
      <Card padding="lg" radius="md" withBorder maw={600}>
        <Stack gap="xs">
          <Text fw={500}>
            <IconInfoCircle size={16} style={{ marginRight: 6 }} />
            Esta plataforma te permite:
          </Text>
          <Text>- Registrar y consultar estudiantes</Text>
          <Text>- Administrar profesores y asignaturas</Text>
          <Text>- Asignar ciclos y controlar matrículas</Text>
        </Stack>

        <Stack align="center" gap="md" mt="xl">
          <Link href="/estudiantes">
            <Button variant="outline" color="blue">
              Ver Estudiantes
            </Button>
          </Link>
          <Link href="/profesores">
            <Button variant="outline" color="blue">
              Ver Profesores
            </Button>
          </Link>
          <Link href="/asignaturas">
            <Button variant="outline" color="blue">
              Ver Asignaturas
            </Button>
          </Link>
          <Link href="/profesores_ciclo">
            <Button variant="outline" color="blue">
              Profesores por Ciclo
            </Button>
          </Link>
          <Link href="/matriculas">
            <Button variant="outline" color="blue">
              Ver Matrículas
            </Button>
          </Link>
        </Stack>
      </Card>
    </Stack>
  )
}

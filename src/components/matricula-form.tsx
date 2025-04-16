"use client"

import { useEffect, useState } from "react"
import { TextInput, NumberInput, Button, Group, Paper, Title, Select, Grid } from "@mantine/core"
import { useForm } from "@mantine/form"
import type { Matricula, MatriculaDetalle } from "@/types/matricula"
import type { Estudiante } from "@/types/estudiante"

interface MatriculaFormProps {
  onSubmit: (values: Omit<Matricula, "version" | "sup">) => Promise<void>
  initialValues?: MatriculaDetalle
  isEditing?: boolean
  onCancel?: () => void
  estudiantes: Estudiante[]
  profesoresCiclo: any[]
}

export function MatriculaForm({
  onSubmit,
  initialValues,
  isEditing = false,
  onCancel,
  estudiantes,
  profesoresCiclo,
}: MatriculaFormProps) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    initialValues: {
      id: "",
      cedula_estudiante: "",
      id_profesores_ciclo: "",
      nota1: 0,
      nota2: 0,
    },
    validate: {
      id: (value) => (!value ? "El ID es obligatorio" : null),
      cedula_estudiante: (value) => (!value ? "El estudiante es obligatorio" : null),
      id_profesores_ciclo: (value) => (!value ? "El profesor y ciclo son obligatorios" : null),
      nota1: (value) => (value < 0 || value > 10 ? "La nota debe estar entre 0 y 10" : null),
      nota2: (value) => (value < 0 || value > 10 ? "La nota debe estar entre 0 y 10" : null),
    },
  })

  useEffect(() => {
    if (initialValues) {
      // Asignamos correctamente los valores iniciales para cedula_estudiante e id_profesores_ciclo
      form.setValues({
        id: initialValues.id || "",
        cedula_estudiante: initialValues.cedula_estudiante || "",
        id_profesores_ciclo: initialValues.id_profesores_ciclo || "",
        nota1: initialValues.nota1 ?? 0,
        nota2: initialValues.nota2 ?? 0,
      })
    }
  }, [initialValues])

  const handleSubmit = async (values: Omit<Matricula, "version" | "sup">) => {
    setSubmitting(true)
    try {
      await onSubmit(values)
      if (!isEditing) {
        form.reset()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const estudiantesOptions = estudiantes.map((est) => ({
    value: est.cedula,
    label: `${est.cedula} - ${est.nombre}`,
  }))

  const profesoresCicloOptions = profesoresCiclo.map((pc) => ({
    value: pc.id.toString(),
    label: `${pc.profesor} - ${pc.asignatura} (${pc.ciclo})`,
  }))

  return (
    <Paper p="md" withBorder>
      <Title order={3} mb="md">
        {isEditing ? "Editar Matrícula" : "Agregar Nueva Matrícula"}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="ID"
              placeholder="Ingrese el ID de la matrícula"
              required
              mb="md"
              disabled={isEditing} // Solo deshabilitado si es edición
              {...form.getInputProps("id")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Estudiante"
              placeholder="Seleccione un estudiante"
              data={estudiantesOptions}
              required
              mb="md"
              searchable
              {...form.getInputProps("cedula_estudiante")}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Select
              label="Profesor - Asignatura - Ciclo"
              placeholder="Seleccione un profesor, asignatura y ciclo"
              data={profesoresCicloOptions}
              required
              mb="md"
              searchable
              {...form.getInputProps("id_profesores_ciclo")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Nota 1"
              placeholder="Ingrese la primera nota"
              required
              mb="md"
              min={0}
              max={10}
              decimalScale={2}
              {...form.getInputProps("nota1")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Nota 2"
              placeholder="Ingrese la segunda nota"
              required
              mb="md"
              min={0}
              max={10}
              decimalScale={2}
              {...form.getInputProps("nota2")}
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
          {isEditing && (
            <Button variant="outline" onClick={onCancel} disabled={submitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" loading={submitting}>
            {isEditing ? "Actualizar" : "Agregar"}
          </Button>
        </Group>
      </form>
    </Paper>
  )
}

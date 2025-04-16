"use client"

import { useState, useEffect } from "react"
import { TextInput, Button, Group, Paper, Title, Select, Grid } from "@mantine/core"
import { useForm } from "@mantine/form"
import type { ProfesorCicloInput } from "@/types/profesor-ciclo"
import type { Profesor } from "@/types/profesor"
import type { Asignatura } from "@/types/asignatura"

interface ProfesorCicloFormProps {
  onSubmit: (values: ProfesorCicloInput) => Promise<void>
  initialValues?: ProfesorCicloInput
  isEditing?: boolean
  onCancel?: () => void
  profesores: Profesor[]
  asignaturas: Asignatura[]
}

export function ProfesorCicloForm({
  onSubmit,
  initialValues,
  isEditing = false,
  onCancel,
  profesores,
  asignaturas,
}: ProfesorCicloFormProps) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    initialValues: {
      id: "",
      cedula: "",
      id_asignaturas: "",
      ciclo: "",
    },
    validate: {
      id: (value) => (!value ? "El ID es obligatorio" : null),
      cedula: (value) => (!value ? "El profesor es obligatorio" : null),
      id_asignaturas: (value) => (!value ? "La asignatura es obligatoria" : null),
      ciclo: (value) => (!value ? "El ciclo es obligatorio" : null),
    },
  })

  // Actualizar el formulario si initialValues cambia
  useEffect(() => {
    if (initialValues) {
      form.setValues({
        id: initialValues.id,
        cedula: initialValues.cedula,
        id_asignaturas: initialValues.id_asignaturas,
        ciclo: initialValues.ciclo,
      })
    }
  }, [initialValues])

  const handleSubmit = async (values: ProfesorCicloInput) => {
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

  const profesoresOptions = profesores.map((prof) => ({
    value: prof.cedula,
    label: `${prof.cedula} - ${prof.nombre}`,
  }))

  const asignaturasOptions = asignaturas.map((asig) => ({
    value: asig.id,
    label: `${asig.id} - ${asig.asignatura}`,
  }))

  const ciclosOptions = [
    { value: "MARZO 2021- AGOSTO 2021", label: "MARZO 2021- AGOSTO 2021" },
    { value: "SEPTIEMBRE 2021 -FEBRERO 2022", label: "SEPTIEMBRE 2021 -FEBRERO 2022" },
    { value: "MARZO 2022 - AGOSTO 2022", label: "MARZO 2022 - AGOSTO 2022" },
    { value: "SEPTIEMBRE 2022 -FEBRERO 2023", label: "SEPTIEMBRE 2022 -FEBRERO 2023" },
  ]

  return (
    <Paper p="md" withBorder>
      <Title order={3} mb="md">
        {isEditing ? "Editar Asignación" : "Asignar Profesor a Ciclo"}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="ID"
              placeholder="Ingrese el ID de la asignación"
              required
              mb="md"
              disabled={isEditing}
              {...form.getInputProps("id")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Profesor"
              placeholder="Seleccione un profesor"
              data={profesoresOptions}
              required
              mb="md"
              searchable
              {...form.getInputProps("cedula")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Asignatura"
              placeholder="Seleccione una asignatura"
              data={asignaturasOptions}
              required
              mb="md"
              searchable
              {...form.getInputProps("id_asignaturas")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Ciclo"
              placeholder="Seleccione un ciclo"
              data={ciclosOptions}
              required
              mb="md"
              {...form.getInputProps("ciclo")}
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
            {isEditing ? "Actualizar" : "Asignar"}
          </Button>
        </Group>
      </form>
    </Paper>
  )
}

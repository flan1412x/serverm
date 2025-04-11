"use client"

import { useState } from "react"
import { TextInput, Button, Group, Paper, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import type { Profesor } from "@/types/profesor"

interface ProfesorFormProps {
  onSubmit: (values: Omit<Profesor, "version">) => Promise<void>
  initialValues?: Profesor
  isEditing?: boolean
  onCancel?: () => void
}

export function ProfesorForm({ onSubmit, initialValues, isEditing = false, onCancel }: ProfesorFormProps) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    initialValues: {
      cedula: initialValues?.cedula || "",
      nombre: initialValues?.nombre || "",
    },
    validate: {
      cedula: (value) => (!value ? "La cédula es obligatoria" : null),
      nombre: (value) => (!value ? "El nombre es obligatorio" : null),
    },
  })

  const handleSubmit = async (values: Omit<Profesor, "version">) => {
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

  return (
    <Paper p="md" withBorder>
      <Title order={3} mb="md">
        {isEditing ? "Editar Profesor" : "Agregar Nuevo Profesor"}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Cédula"
          placeholder="Ingrese la cédula del profesor"
          required
          mb="md"
          disabled={isEditing}
          {...form.getInputProps("cedula")}
        />

        <TextInput
          label="Nombre"
          placeholder="Ingrese el nombre completo del profesor"
          required
          mb="md"
          {...form.getInputProps("nombre")}
        />

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


"use client"

import { useState } from "react"
import { TextInput, Button, Group, Paper, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import type { Asignatura } from "@/types/asignatura"

interface AsignaturaFormProps {
  onSubmit: (values: Omit<Asignatura, "version">) => Promise<void>
  initialValues?: Asignatura
  isEditing?: boolean
  onCancel?: () => void
}

export function AsignaturaForm({ onSubmit, initialValues, isEditing = false, onCancel }: AsignaturaFormProps) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    initialValues: {
      id: initialValues?.id || "",
      asignatura: initialValues?.asignatura || "",
    },
    validate: {
      id: (value) => (!value ? "El ID es obligatorio" : null),
      asignatura: (value) => (!value ? "El nombre de la asignatura es obligatorio" : null),
    },
  })

  const handleSubmit = async (values: Omit<Asignatura, "version">) => {
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
        {isEditing ? "Editar Asignatura" : "Agregar Nueva Asignatura"}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="ID"
          placeholder="Ingrese el ID de la asignatura"
          required
          mb="md"
          disabled={isEditing}
          {...form.getInputProps("id")}
        />

        <TextInput
          label="Nombre de la Asignatura"
          placeholder="Ingrese el nombre de la asignatura"
          required
          mb="md"
          {...form.getInputProps("asignatura")}
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


"use client"

import { useEffect, useState } from "react"
import { TextInput, Button, Group, Paper, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import type { Estudiante } from "@/types/estudiante"

interface EstudianteFormProps {
  onSubmit: (values: Omit<Estudiante, "version">) => Promise<void>
  initialValues?: Estudiante
  isEditing?: boolean
  onCancel?: () => void
}

export function EstudianteForm({
  onSubmit,
  initialValues,
  isEditing = false,
  onCancel,
}: EstudianteFormProps) {
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

  // 🔁 Actualiza los campos cuando cambian los initialValues
  useEffect(() => {
    if (initialValues) {
      form.setValues({
        cedula: initialValues.cedula,
        nombre: initialValues.nombre,
      })
    }
  }, [initialValues])

  const handleSubmit = async (values: Omit<Estudiante, "version">) => {
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
        {isEditing ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {isEditing ? (
          <>
            <TextInput
              label="Cédula"
              required
              mb="md"
              value={form.values.cedula}
              disabled
            />
            <input type="hidden" name="cedula" value={form.values.cedula} />
          </>
        ) : (
          <TextInput
            label="Cédula"
            placeholder="Ingrese la cédula del estudiante"
            required
            mb="md"
            {...form.getInputProps("cedula")}
          />
        )}

        <TextInput
          label="Nombre"
          placeholder="Ingrese el nombre completo del estudiante"
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

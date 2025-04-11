"use client"

import { useState, useEffect } from "react"
import { Container, Title, Space, Loader, Center } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { EstudiantesTable } from "@/components/estudiantes-table"
import { EstudianteForm } from "@/components/estudiante-form"
import type { Estudiante } from "@/types/estudiante"

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null)

  // Fetch all students on component mount
  useEffect(() => {
    fetchEstudiantes()
  }, [])

  // Function to fetch all students
  const fetchEstudiantes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/estudiantes")
      const data = await response.json()

      if (data.success) {
        setEstudiantes(data.data)
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudieron cargar los estudiantes",
          color: "red",
        })
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Error al conectar con el servidor",
        color: "red",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to handle student creation
  const handleCreateEstudiante = async (estudiante: Omit<Estudiante, "version">) => {
    try {
      const response = await fetch("/api/estudiantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(estudiante),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Estudiante creado correctamente",
          color: "green",
        })
        fetchEstudiantes()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo crear el estudiante",
          color: "red",
        })
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Error al conectar con el servidor",
        color: "red",
      })
    }
  }

  // Function to handle student update
  const handleUpdateEstudiante = async (estudiante: Omit<Estudiante, "version">) => {
    try {
      const response = await fetch("/api/estudiantes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(estudiante),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Estudiante actualizado correctamente",
          color: "green",
        })
        setEditingEstudiante(null)
        fetchEstudiantes()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo actualizar el estudiante",
          color: "red",
        })
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Error al conectar con el servidor",
        color: "red",
      })
    }
  }

  // Function to handle student deletion
  const handleDeleteEstudiante = async (cedula: string) => {
    try {
      const response = await fetch(`/api/estudiantes?cedula=${cedula}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Estudiante eliminado correctamente",
          color: "green",
        })
        fetchEstudiantes()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo eliminar el estudiante",
          color: "red",
        })
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Error al conectar con el servidor",
        color: "red",
      })
    }
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        Gestión de Estudiantes
      </Title>

      <EstudianteForm
        onSubmit={editingEstudiante ? handleUpdateEstudiante : handleCreateEstudiante}
        initialValues={editingEstudiante || undefined}
        isEditing={!!editingEstudiante}
        onCancel={() => setEditingEstudiante(null)}
      />

      <Space h="xl" />

      {loading ? (
        <Center>
          <Loader size="lg" />
        </Center>
      ) : (
        <EstudiantesTable estudiantes={estudiantes} onEdit={setEditingEstudiante} onDelete={handleDeleteEstudiante} />
      )}
    </Container>
  )
}


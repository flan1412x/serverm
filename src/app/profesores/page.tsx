"use client"

import { useState, useEffect } from "react"
import { Container, Title, Space, Loader, Center } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { ProfesoresTable } from "@/components/profesores-table"
import { ProfesorForm } from "@/components/profesor-form"
import type { Profesor } from "@/types/profesor"

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfesor, setEditingProfesor] = useState<Profesor | null>(null)

  // Fetch all profesores on component mount
  useEffect(() => {
    fetchProfesores()
  }, [])

  // Function to fetch all profesores
  const fetchProfesores = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/profesores")
      const data = await response.json()

      if (data.success) {
        setProfesores(data.data)
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudieron cargar los profesores",
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

  // Function to handle profesor creation
  const handleCreateProfesor = async (profesor: Omit<Profesor, "version">) => {
    try {
      const response = await fetch("/api/profesores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profesor),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Profesor creado correctamente",
          color: "green",
        })
        fetchProfesores()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo crear el profesor",
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

  // Function to handle profesor update
  const handleUpdateProfesor = async (profesor: Omit<Profesor, "version">) => {
    try {
      const response = await fetch("/api/profesores", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profesor),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Profesor actualizado correctamente",
          color: "green",
        })
        setEditingProfesor(null)
        fetchProfesores()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo actualizar el profesor",
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

  // Function to handle profesor deletion
  const handleDeleteProfesor = async (cedula: string) => {
    try {
      const response = await fetch(`/api/profesores?cedula=${cedula}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Profesor eliminado correctamente",
          color: "green",
        })
        fetchProfesores()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo eliminar el profesor",
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
        Gestión de Profesores
      </Title>

      <ProfesorForm
        onSubmit={editingProfesor ? handleUpdateProfesor : handleCreateProfesor}
        initialValues={editingProfesor || undefined}
        isEditing={!!editingProfesor}
        onCancel={() => setEditingProfesor(null)}
      />

      <Space h="xl" />

      {loading ? (
        <Center>
          <Loader size="lg" />
        </Center>
      ) : (
        <ProfesoresTable profesores={profesores} onEdit={setEditingProfesor} onDelete={handleDeleteProfesor} />
      )}
    </Container>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Container, Title, Space, Loader, Center } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { AsignaturasTable } from "@/components/asignaturas-table"
import { AsignaturaForm } from "@/components/asignatura-form"
import type { Asignatura } from "@/types/asignatura"

export default function AsignaturasPage() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAsignatura, setEditingAsignatura] = useState<Asignatura | null>(null)

  // Fetch all subjects on component mount
  useEffect(() => {
    fetchAsignaturas()
  }, [])

  // Function to fetch all subjects
  const fetchAsignaturas = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/asignaturas")
      const data = await response.json()

      if (data.success) {
        setAsignaturas(data.data)
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudieron cargar las asignaturas",
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

  // Function to handle subject creation
  const handleCreateAsignatura = async (asignatura: Omit<Asignatura, "version">) => {
    try {
      const response = await fetch("/api/asignaturas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(asignatura),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Asignatura creada correctamente",
          color: "green",
        })
        fetchAsignaturas()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo crear la asignatura",
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

  // Function to handle subject update
  const handleUpdateAsignatura = async (asignatura: Omit<Asignatura, "version">) => {
    try {
      const response = await fetch("/api/asignaturas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(asignatura),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Asignatura actualizada correctamente",
          color: "green",
        })
        setEditingAsignatura(null)
        fetchAsignaturas()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo actualizar la asignatura",
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

  // Function to handle subject deletion
  const handleDeleteAsignatura = async (id: string) => {
    try {
      const response = await fetch(`/api/asignaturas?id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Asignatura eliminada correctamente",
          color: "green",
        })
        fetchAsignaturas()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo eliminar la asignatura",
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
        Gestión de Asignaturas
      </Title>

      <AsignaturaForm
        onSubmit={editingAsignatura ? handleUpdateAsignatura : handleCreateAsignatura}
        initialValues={editingAsignatura || undefined}
        isEditing={!!editingAsignatura}
        onCancel={() => setEditingAsignatura(null)}
      />

      <Space h="xl" />

      {loading ? (
        <Center>
          <Loader size="lg" />
        </Center>
      ) : (
        <AsignaturasTable asignaturas={asignaturas} onEdit={setEditingAsignatura} onDelete={handleDeleteAsignatura} />
      )}
    </Container>
  )
}


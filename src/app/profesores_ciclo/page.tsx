"use client"

import { useState, useEffect } from "react"
import { Container, Title, Space, Loader, Center } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { ProfesoresCicloTable } from "@/components/profesores-ciclo-table"
import { ProfesorCicloForm } from "@/components/profesor-ciclo-form"
import type { ProfesorCicloDetalle, ProfesorCicloInput } from "@/types/profesor-ciclo"
import type { Profesor } from "@/types/profesor"
import type { Asignatura } from "@/types/asignatura"

export default function ProfesoresCicloPage() {
  const [profesoresCiclo, setProfesoresCiclo] = useState<ProfesorCicloDetalle[]>([])
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfesorCiclo, setEditingProfesorCiclo] = useState<ProfesorCicloDetalle | null>(null)

  // Fetch all data on component mount
  useEffect(() => {
    fetchProfesoresCiclo()
    fetchProfesores()
    fetchAsignaturas()
  }, [])

  // Function to fetch all profesores_ciclo
  const fetchProfesoresCiclo = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/profesores_ciclo")
      const data = await response.json()

      if (data.success) {
        setProfesoresCiclo(data.data)
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudieron cargar los profesores por ciclo",
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

  // Function to fetch all profesores for the select
  const fetchProfesores = async () => {
    try {
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
    }
  }

  // Function to fetch all asignaturas for the select
  const fetchAsignaturas = async () => {
    try {
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
    }
  }

  // Function to handle profesor_ciclo creation
  const handleCreateProfesorCiclo = async (profesorCiclo: ProfesorCicloInput) => {
    try {
      const response = await fetch("/api/profesores_ciclo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profesorCiclo),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Profesor asignado correctamente",
          color: "green",
        })
        fetchProfesoresCiclo()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo asignar el profesor",
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

  // Function to handle profesor_ciclo update
  const handleUpdateProfesorCiclo = async (profesorCiclo: ProfesorCicloInput) => {
    try {
      const response = await fetch("/api/profesores_ciclo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profesorCiclo),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Asignación actualizada correctamente",
          color: "green",
        })
        setEditingProfesorCiclo(null)
        fetchProfesoresCiclo()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo actualizar la asignación",
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

  // Function to handle profesor_ciclo deletion
  const handleDeleteProfesorCiclo = async (id: string) => {
    try {
      const response = await fetch(`/api/profesores_ciclo?id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Asignación eliminada correctamente",
          color: "green",
        })
        fetchProfesoresCiclo()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo eliminar la asignación",
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
        Asignación de Profesores a Ciclos
      </Title>

      <ProfesorCicloForm
        onSubmit={editingProfesorCiclo ? handleUpdateProfesorCiclo : handleCreateProfesorCiclo}
        initialValues={
          editingProfesorCiclo
            ? {
                id: editingProfesorCiclo.id,
                cedula: profesores.find((p) => p.nombre === editingProfesorCiclo.profesor)?.cedula || "",
                id_asignaturas: asignaturas.find((a) => a.asignatura === editingProfesorCiclo.asignatura)?.id || "",
                ciclo: editingProfesorCiclo.ciclo,
              }
            : undefined
        }
        isEditing={!!editingProfesorCiclo}
        onCancel={() => setEditingProfesorCiclo(null)}
        profesores={profesores}
        asignaturas={asignaturas}
      />

      <Space h="xl" />

      {loading ? (
        <Center>
          <Loader size="lg" />
        </Center>
      ) : (
        <ProfesoresCicloTable
          profesoresCiclo={profesoresCiclo}
          onEdit={setEditingProfesorCiclo}
          onDelete={handleDeleteProfesorCiclo}
        />
      )}
    </Container>
  )
}


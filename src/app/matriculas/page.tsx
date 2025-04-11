"use client"

import { useState, useEffect } from "react"
import { Container, Title, Space, Loader, Center } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { MatriculasTable } from "@/components/matriculas-table"
import { MatriculaForm } from "@/components/matricula-form"
import type { Matricula, MatriculaDetalle } from "@/types/matricula"
import type { Estudiante } from "@/types/estudiante"

export default function MatriculasPage() {
  const [matriculas, setMatriculas] = useState<MatriculaDetalle[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [profesoresCiclo, setProfesoresCiclo] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMatricula, setEditingMatricula] = useState<MatriculaDetalle | null>(null)

  // Fetch all data on component mount
  useEffect(() => {
    fetchMatriculas()
    fetchEstudiantes()
    fetchProfesoresCiclo()
  }, [])

  // Function to fetch all matriculas
  const fetchMatriculas = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/matriculas")
      const data = await response.json()

      if (data.success) {
        setMatriculas(data.data)
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudieron cargar las matrículas",
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

  // Function to fetch all estudiantes for the select
  const fetchEstudiantes = async () => {
    try {
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
    }
  }

  // Function to fetch all profesores_ciclo for the select
  const fetchProfesoresCiclo = async () => {
    try {
      const response = await fetch("/api/profesores_ciclo")
      const data = await response.json()

      if (data.success) {
        setProfesoresCiclo(data.data)
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudieron cargar los profesores y ciclos",
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

  // Function to handle matricula creation
  const handleCreateMatricula = async (matricula: Omit<Matricula, "version" | "sup">) => {
    try {
      const response = await fetch("/api/matriculas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matricula),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Matrícula creada correctamente",
          color: "green",
        })
        fetchMatriculas()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo crear la matrícula",
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

  // Function to handle matricula update
  const handleUpdateMatricula = async (matricula: Omit<Matricula, "version" | "sup">) => {
    try {
      const response = await fetch("/api/matriculas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matricula),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Matrícula actualizada correctamente",
          color: "green",
        })
        setEditingMatricula(null)
        fetchMatriculas()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo actualizar la matrícula",
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

  // Function to handle matricula deletion
  const handleDeleteMatricula = async (id: string) => {
    try {
      const response = await fetch(`/api/matriculas?id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: "Éxito",
          message: "Matrícula eliminada correctamente",
          color: "green",
        })
        fetchMatriculas()
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "No se pudo eliminar la matrícula",
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
        Gestión de Matrículas
      </Title>

      <MatriculaForm
        onSubmit={editingMatricula ? handleUpdateMatricula : handleCreateMatricula}
        initialValues={editingMatricula || undefined}
        isEditing={!!editingMatricula}
        onCancel={() => setEditingMatricula(null)}
        estudiantes={estudiantes}
        profesoresCiclo={profesoresCiclo}
      />

      <Space h="xl" />

      {loading ? (
        <Center>
          <Loader size="lg" />
        </Center>
      ) : (
        <MatriculasTable matriculas={matriculas} onEdit={setEditingMatricula} onDelete={handleDeleteMatricula} />
      )}
    </Container>
  )
}


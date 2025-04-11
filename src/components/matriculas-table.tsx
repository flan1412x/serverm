"use client"

import { useState } from "react"
import { Table, Button, Group, Text, Modal, Badge, Tooltip } from "@mantine/core"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import type { MatriculaDetalle } from "@/types/matricula"

interface MatriculasTableProps {
  matriculas: MatriculaDetalle[]
  onEdit: (matricula: MatriculaDetalle) => void
  onDelete: (id: string) => Promise<void>
}

export function MatriculasTable({ matriculas, onEdit, onDelete }: MatriculasTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return

    setDeleting(true)
    try {
      await onDelete(deleteConfirm)
    } finally {
      setDeleting(false)
      setDeleteConfirm(null)
    }
  }

  // Función para calcular el promedio
  const calcularPromedio = (nota1: number, nota2: number) => {
    return ((nota1 + nota2) / 2).toFixed(2)
  }

  // Función para determinar el estado (aprobado/supletorio)
  const getEstado = (sup: number) => {
    return sup === 0
  }

  return (
    <>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Estudiante</Table.Th>
            <Table.Th>Profesor</Table.Th>
            <Table.Th>Ciclo</Table.Th>
            <Table.Th>Asignatura</Table.Th>
            <Table.Th>Nota 1</Table.Th>
            <Table.Th>Nota 2</Table.Th>
            <Table.Th>Promedio</Table.Th>
            <Table.Th>Estado</Table.Th>
            <Table.Th>Versión</Table.Th>
            <Table.Th style={{ width: 120 }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {matriculas.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={11}>
                <Text ta="center" fz="sm" c="dimmed" py="md">
                  No hay matrículas registradas
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            matriculas.map((matricula) => (
              <Table.Tr key={matricula.id}>
                <Table.Td>{matricula.id}</Table.Td>
                <Table.Td>{matricula.estudiantes}</Table.Td>
                <Table.Td>{matricula.profesores}</Table.Td>
                <Table.Td>{matricula.ciclo}</Table.Td>
                <Table.Td>{matricula.asignatura}</Table.Td>
                <Table.Td>{matricula.nota1}</Table.Td>
                <Table.Td>{matricula.nota2}</Table.Td>
                <Table.Td>{calcularPromedio(matricula.nota1, matricula.nota2)}</Table.Td>
                <Table.Td>
                  <Badge color={getEstado(matricula.sup) ? "green" : "yellow"}>
                    {getEstado(matricula.sup) ? "Aprobado" : "Supletorio"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color="blue" variant="light">
                    v{matricula.version}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Tooltip label="Editar">
                      <Button size="compact-xs" variant="light" color="blue" onClick={() => onEdit(matricula)}>
                        <IconEdit size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip label="Eliminar">
                      <Button
                        size="compact-xs"
                        variant="light"
                        color="red"
                        onClick={() => setDeleteConfirm(matricula.id)}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <Modal opened={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar eliminación" centered>
        <Text size="sm" mb="lg">
          ¿Está seguro que desea eliminar esta matrícula? Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleConfirmDelete} loading={deleting}>
            Eliminar
          </Button>
        </Group>
      </Modal>
    </>
  )
}


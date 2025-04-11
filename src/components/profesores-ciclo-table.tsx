"use client"

import { useState } from "react"
import { Table, Button, Group, Text, Modal, Badge, Tooltip } from "@mantine/core"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import type { ProfesorCicloDetalle } from "@/types/profesor-ciclo"

interface ProfesoresCicloTableProps {
  profesoresCiclo: ProfesorCicloDetalle[]
  onEdit: (profesorCiclo: ProfesorCicloDetalle) => void
  onDelete: (id: string) => Promise<void>
}

export function ProfesoresCicloTable({ profesoresCiclo, onEdit, onDelete }: ProfesoresCicloTableProps) {
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

  return (
    <>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Profesor</Table.Th>
            <Table.Th>Asignatura</Table.Th>
            <Table.Th>Ciclo</Table.Th>
            <Table.Th>Versión</Table.Th>
            <Table.Th style={{ width: 120 }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {profesoresCiclo.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" fz="sm" c="dimmed" py="md">
                  No hay asignaciones de profesores a ciclos
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            profesoresCiclo.map((pc) => (
              <Table.Tr key={pc.id}>
                <Table.Td>{pc.id}</Table.Td>
                <Table.Td>{pc.profesor}</Table.Td>
                <Table.Td>{pc.asignatura}</Table.Td>
                <Table.Td>{pc.ciclo}</Table.Td>
                <Table.Td>
                  <Badge color="blue" variant="light">
                    v{pc.version}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Tooltip label="Editar">
                      <Button size="compact-xs" variant="light" color="blue" onClick={() => onEdit(pc)}>
                        <IconEdit size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip label="Eliminar">
                      <Button size="compact-xs" variant="light" color="red" onClick={() => setDeleteConfirm(pc.id)}>
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
          ¿Está seguro que desea eliminar esta asignación? Esta acción no se puede deshacer.
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


"use client"

import { useState } from "react"
import { Table, Button, Group, Text, Modal, Badge } from "@mantine/core"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import type { Asignatura } from "@/types/asignatura"

interface AsignaturasTableProps {
  asignaturas: Asignatura[]
  onEdit: (asignatura: Asignatura) => void
  onDelete: (id: string) => Promise<void>
}

export function AsignaturasTable({ asignaturas, onEdit, onDelete }: AsignaturasTableProps) {
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
            <Table.Th>Asignatura</Table.Th>
            <Table.Th>Versión</Table.Th>
            <Table.Th style={{ width: 120 }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {asignaturas.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center" fz="sm" c="dimmed" py="md">
                  No hay asignaturas registradas
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            asignaturas.map((asignatura) => (
              <Table.Tr key={asignatura.id}>
                <Table.Td>{asignatura.id}</Table.Td>
                <Table.Td>{asignatura.asignatura}</Table.Td>
                <Table.Td>
                  <Badge color="blue" variant="light">
                    v{asignatura.version}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="compact-xs" variant="light" color="blue" onClick={() => onEdit(asignatura)}>
                      <IconEdit size={16} />
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="light"
                      color="red"
                      onClick={() => setDeleteConfirm(asignatura.id)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <Modal opened={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar eliminación" centered>
        <Text size="sm" mb="lg">
          ¿Está seguro que desea eliminar esta asignatura? Esta acción no se puede deshacer.
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


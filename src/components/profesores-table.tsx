"use client"

import { useState } from "react"
import { Table, Button, Group, Text, Modal, Badge } from "@mantine/core"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import type { Profesor } from "@/types/profesor"

interface ProfesoresTableProps {
  profesores: Profesor[]
  onEdit: (profesor: Profesor) => void
  onDelete: (cedula: string) => Promise<void>
}

export function ProfesoresTable({ profesores, onEdit, onDelete }: ProfesoresTableProps) {
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
            <Table.Th>Cédula</Table.Th>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Versión</Table.Th>
            <Table.Th style={{ width: 120 }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {profesores.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center" fz="sm" c="dimmed" py="md">
                  No hay profesores registrados
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            profesores.map((profesor) => (
              <Table.Tr key={profesor.cedula}>
                <Table.Td>{profesor.cedula}</Table.Td>
                <Table.Td>{profesor.nombre}</Table.Td>
                <Table.Td>
                  <Badge color="blue" variant="light">
                    v{profesor.version}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="compact-xs" variant="light" color="blue" onClick={() => onEdit(profesor)}>
                      <IconEdit size={16} />
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="light"
                      color="red"
                      onClick={() => setDeleteConfirm(profesor.cedula)}
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
          ¿Está seguro que desea eliminar este profesor? Esta acción no se puede deshacer.
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


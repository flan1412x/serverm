import { type NextRequest, NextResponse } from "next/server"
import { getDb, sendToMiddleware } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const profesoresCiclo = await db.all(`
      SELECT pc.id, p.nombre AS profesor, a.asignatura, pc.ciclo, pc.version
      FROM profesores_ciclo pc
      JOIN profesores p ON pc.cedula = p.cedula
      JOIN asignaturas a ON pc.id_asignaturas = a.id
    `)
    return NextResponse.json({ success: true, data: profesoresCiclo })
  } catch (error) {
    console.error("Error al obtener profesores por ciclo:", error)
    return NextResponse.json({ success: false, error: "Error al obtener profesores por ciclo" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const data = await request.json()
    const { id,cedula, id_asignaturas, ciclo } = data

    // Validación de datos
    if (!id || !cedula || !id_asignaturas || !ciclo) {
      return NextResponse.json({ success: false, error: "ID,Cedula, asignatura y ciclo son obligatorios" }, { status: 400 })
    }

    // Verificar si ya existe una asignación para este ciclo, profesor y asignatura
    const existingProfesorCiclo = await db.get(`
      SELECT * FROM profesores_ciclo
      WHERE cedula = ? AND id_asignaturas = ? AND ciclo = ?
    `,  cedula, id_asignaturas, ciclo)
    
    if (existingProfesorCiclo) {
      return NextResponse.json({ success: false, error: "El profesor ya está asignado a esta asignatura en este ciclo" }, { status: 400 })
    }

    // Insertar nuevo registro en la tabla profesores_ciclo con versión inicial 1
    await db.run(`
      INSERT INTO profesores_ciclo (id ,cedula, id_asignaturas, ciclo, version)
      VALUES (?,?, ?, ?, 1)
    `, id ,cedula, id_asignaturas, ciclo)

    // Obtener el registro recién creado
    const nuevoProfesorCiclo = await db.get(`
      SELECT pc.id, p.nombre AS profesor, a.asignatura, pc.ciclo, pc.version
      FROM profesores_ciclo pc
      JOIN profesores p ON pc.cedula = p.cedula
      JOIN asignaturas a ON pc.id_asignaturas = a.id
      WHERE pc.cedula = ? AND pc.id_asignaturas = ? AND pc.ciclo = ?
    `, cedula, id_asignaturas, ciclo)

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || ""
    if (userAgent !== "middleware") {
      await sendToMiddleware("/profesores_ciclo", "POST", { ...nuevoProfesorCiclo, userAgent })
    }

    return NextResponse.json({ success: true, data: nuevoProfesorCiclo }, { status: 201 })
  } catch (error) {
    console.error("Error al crear profesor-ciclo:", error)
    return NextResponse.json({ success: false, error: "Error al crear profesor-ciclo" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb()
    const data = await request.json()
    const { id, cedula, id_asignaturas, ciclo } = data

    // Validación de datos
    if (!id || !cedula || !id_asignaturas || !ciclo) {
      return NextResponse.json({ success: false, error: "ID, Cedula, Asignatura y Ciclo son obligatorios" }, { status: 400 })
    }

    // Verificar si el profesor-ciclo existe
    const profesorCiclo = await db.get(`
      SELECT * FROM profesores_ciclo WHERE id = ?
    `, id)

    if (!profesorCiclo) {
      return NextResponse.json({ success: false, error: "Profesor-Ciclo no encontrado" }, { status: 404 })
    }

    // Incrementar la versión
    const nuevaVersion = profesorCiclo.version + 1

    // Actualizar el profesor-ciclo
    await db.run(`
      UPDATE profesores_ciclo SET cedula = ?, id_asignaturas = ?, ciclo = ?, version = ?
      WHERE id = ?
    `, cedula, id_asignaturas, ciclo, nuevaVersion, id)

    // Obtener el profesor-ciclo actualizado
    const profesorCicloActualizado = await db.get(`
      SELECT pc.id, p.nombre AS profesor, a.asignatura, pc.ciclo, pc.version
      FROM profesores_ciclo pc
      JOIN profesores p ON pc.cedula = p.cedula
      JOIN asignaturas a ON pc.id_asignaturas = a.id
      WHERE pc.id = ?
    `, id)

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || ""
    if (userAgent !== "middleware") {
      await sendToMiddleware("/profesores_ciclo", "PUT", { ...profesorCicloActualizado, userAgent })
    }

    return NextResponse.json({ success: true, data: profesorCicloActualizado })
  } catch (error) {
    console.error("Error al actualizar profesor-ciclo:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar profesor-ciclo" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Se requiere el ID del profesor-ciclo" }, { status: 400 })
    }

    // Verificar si el profesor-ciclo existe
    const profesorCiclo = await db.get(`
      SELECT * FROM profesores_ciclo WHERE id = ?
    `, id)

    if (!profesorCiclo) {
      return NextResponse.json({ success: false, error: "Profesor-Ciclo no encontrado" }, { status: 404 })
    }

    // Eliminar el profesor-ciclo
    await db.run(`
      DELETE FROM profesores_ciclo WHERE id = ?
    `, id)

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || ""
    if (userAgent !== "middleware") {
      await sendToMiddleware("/profesores_ciclo", "DELETE", { id, userAgent })
    }

    return NextResponse.json({ success: true, message: "Profesor-Ciclo eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar profesor-ciclo:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar profesor-ciclo" }, { status: 500 })
  }
}

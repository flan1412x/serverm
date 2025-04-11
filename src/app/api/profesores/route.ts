import { type NextRequest, NextResponse } from "next/server"
import { getDb, sendToMiddleware } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const profesores = await db.all("SELECT * FROM profesores")
    return NextResponse.json({ success: true, data: profesores })
  } catch (error) {
    console.error("Error al obtener profesores:", error)
    return NextResponse.json({ success: false, error: "Error al obtener profesores" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const data = await request.json()
    const { cedula, nombre } = data

    // Validación de datos
    if (!cedula || !nombre) {
      return NextResponse.json({ success: false, error: "Cedula y nombre son obligatorios" }, { status: 400 })
    }

    // Verificar si ya existe
    const existingProfesor = await db.get("SELECT * FROM profesores WHERE cedula = ?", cedula)
    if (existingProfesor) {
      return NextResponse.json({ success: false, error: "El profesor ya existe" }, { status: 400 })
    }

    // Insertar nuevo profesor con versión inicial 1
    await db.run("INSERT INTO profesores (cedula, nombre, version) VALUES (?, ?, 1)", cedula, nombre)

    // Obtener el profesor recién creado
    const nuevoProfesor = await db.get("SELECT * FROM profesores WHERE cedula = ?", cedula)

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || ""
    if (userAgent !== "middleware") {
      await sendToMiddleware("/profesores", "POST", { ...nuevoProfesor, userAgent })
    }

    return NextResponse.json({ success: true, data: nuevoProfesor }, { status: 201 })
  } catch (error) {
    console.error("Error al crear profesor:", error)
    return NextResponse.json({ success: false, error: "Error al crear profesor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb()
    const data = await request.json()
    const { cedula, nombre } = data

    // Validación de datos
    if (!cedula || !nombre) {
      return NextResponse.json({ success: false, error: "Cedula y nombre son obligatorios" }, { status: 400 })
    }

    // Verificar si existe
    const profesor = await db.get("SELECT * FROM profesores WHERE cedula = ?", cedula)
    if (!profesor) {
      return NextResponse.json({ success: false, error: "Profesor no encontrado" }, { status: 404 })
    }

    // Incrementar versión
    const nuevaVersion = profesor.version + 1

    // Actualizar profesor
    await db.run("UPDATE profesores SET nombre = ?, version = ? WHERE cedula = ?", nombre, nuevaVersion, cedula)

    // Obtener el profesor actualizado
    const profesorActualizado = await db.get("SELECT * FROM profesores WHERE cedula = ?", cedula)

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || ""
    if (userAgent !== "middleware") {
      await sendToMiddleware("/profesores", "PUT", { ...profesorActualizado, userAgent })
    }

    return NextResponse.json({ success: true, data: profesorActualizado })
  } catch (error) {
    console.error("Error al actualizar profesor:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar profesor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const cedula = searchParams.get("cedula")

    if (!cedula) {
      return NextResponse.json({ success: false, error: "Se requiere la cédula del profesor" }, { status: 400 })
    }

    // Verificar si existe
    const profesor = await db.get("SELECT * FROM profesores WHERE cedula = ?", cedula)
    if (!profesor) {
      return NextResponse.json({ success: false, error: "Profesor no encontrado" }, { status: 404 })
    }

    // Eliminar profesor
    await db.run("DELETE FROM profesores WHERE cedula = ?", cedula)

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || ""
    if (userAgent !== "middleware") {
      await sendToMiddleware("/profesores", "DELETE", { cedula, userAgent })
    }

    return NextResponse.json({ success: true, message: "Profesor eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar profesor:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar profesor" }, { status: 500 })
  }
}

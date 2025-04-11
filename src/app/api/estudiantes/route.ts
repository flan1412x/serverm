import { type NextRequest, NextResponse } from "next/server"
import { getDb, sendToMiddleware } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const estudiantes = await db.all("SELECT * FROM estudiantes")
    return NextResponse.json({ success: true, data: estudiantes })
  } catch (error) {
    console.error("Error al obtener estudiantes:", error)
    return NextResponse.json({ success: false, error: "Error al obtener estudiantes" }, { status: 500 })
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
    const existingEstudiante = await db.get("SELECT * FROM estudiantes WHERE cedula = ?", cedula)
    if (existingEstudiante) {
      return NextResponse.json({ success: false, error: "El estudiante ya existe" }, { status: 400 })
    }

    // Insertar nuevo estudiante con versión inicial 1
    await db.run("INSERT INTO estudiantes (cedula, nombre, version) VALUES (?, ?, 1)", cedula, nombre)

    // Obtener el estudiante recién creado
    const nuevoEstudiante = await db.get("SELECT * FROM estudiantes WHERE cedula = ?", cedula)

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || ""
    if (userAgent !== "middleware") {
      await sendToMiddleware("/estudiantes", "POST", { ...nuevoEstudiante, userAgent })
    }

    return NextResponse.json({ success: true, data: nuevoEstudiante }, { status: 201 })
  } catch (error) {
    console.error("Error al crear estudiante:", error)
    return NextResponse.json({ success: false, error: "Error al crear estudiante" }, { status: 500 })
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
    const estudiante = await db.get("SELECT * FROM estudiantes WHERE cedula = ?", cedula)
    if (!estudiante) {
      return NextResponse.json({ success: false, error: "Estudiante no encontrado" }, { status: 404 })
    }

    // Incrementar versión
    const nuevaVersion = estudiante.version + 1

    // Actualizar estudiante
    await db.run("UPDATE estudiantes SET nombre = ?, version = ? WHERE cedula = ?", nombre, nuevaVersion, cedula)

    // Obtener el estudiante actualizado
    const estudianteActualizado = await db.get("SELECT * FROM estudiantes WHERE cedula = ?", cedula)

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || ""
    console.log("User-Agent:", userAgent);
    if (userAgent !== "middleware") {
      await sendToMiddleware("/estudiantes", "PUT", { ...estudianteActualizado, userAgent })
    }

    return NextResponse.json({ success: true, data: estudianteActualizado })
  } catch (error) {
    console.error("Error al actualizar estudiante:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar estudiante" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const cedula = searchParams.get("cedula")

    if (!cedula) {
      return NextResponse.json({ success: false, error: "Se requiere la cédula del estudiante" }, { status: 400 })
    }

    // Verificar si existe
    const estudiante = await db.get("SELECT * FROM estudiantes WHERE cedula = ?", cedula)
    if (!estudiante) {
      return NextResponse.json({ success: false, error: "Estudiante no encontrado" }, { status: 404 })
    }

    // Eliminar estudiante
    await db.run("DELETE FROM estudiantes WHERE cedula = ?", cedula)

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || ""
    if (userAgent !== "middleware") {
      await sendToMiddleware("/estudiantes", "DELETE", { cedula, userAgent })
    }

    return NextResponse.json({ success: true, message: "Estudiante eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar estudiante:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar estudiante" }, { status: 500 })
  }
}

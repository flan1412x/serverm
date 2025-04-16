import { type NextRequest, NextResponse } from "next/server"
import { getDb, sendToMiddleware } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const asignaturas = await db.all("SELECT * FROM asignaturas")
    return NextResponse.json({ success: true, data: asignaturas })
  } catch (error) {
    console.error("Error al obtener asignaturas:", error)
    return NextResponse.json({ success: false, error: "Error al obtener asignaturas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const data = await request.json()
    const { id, asignatura } = data

    // Validación de datos
    if (!id || !asignatura) {
      return NextResponse.json({ success: false, error: "ID y asignatura son obligatorios" }, { status: 400 })
    }

    // Verificar si ya existe
    const existingAsignatura = await db.get("SELECT * FROM asignaturas WHERE id = ?", id)
    if (existingAsignatura) {
      return NextResponse.json({ success: false, error: "La asignatura ya existe" }, { status: 400 })
    }

    // Insertar nueva asignatura con versión inicial 1
    await db.run("INSERT INTO asignaturas (id, asignatura, version) VALUES (?, ?, 1)", id, asignatura)

    // Obtener la asignatura recién creada
    const nuevaAsignatura = await db.get("SELECT * FROM asignaturas WHERE id = ?", id)

    // Obtener el user-agent
    const userAgent = request.headers.get("user-agent") || "";
    console.log("User-Agent:", userAgent);

    // Enviar al middleware si el user-agent no es del middleware
    if (userAgent !== "middleware") {
      await sendToMiddleware("/api/asignaturas", "POST", { ...nuevaAsignatura, userAgent })
    }

    return NextResponse.json({ success: true, data: nuevaAsignatura }, { status: 201 })
  } catch (error) {
    console.error("Error al crear asignatura:", error)
    return NextResponse.json({ success: false, error: "Error al crear asignatura" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb()
    const data = await request.json()
    const { id, asignatura } = data

    // Validación de datos
    if (!id || !asignatura) {
      return NextResponse.json({ success: false, error: "ID y asignatura son obligatorios" }, { status: 400 })
    }

    // Verificar si existe
    const asignaturaExistente = await db.get("SELECT * FROM asignaturas WHERE id = ?", id)
    if (!asignaturaExistente) {
      return NextResponse.json({ success: false, error: "Asignatura no encontrada" }, { status: 404 })
    }

    // Incrementar versión
    const nuevaVersion = asignaturaExistente.version + 1

    // Actualizar asignatura
    await db.run("UPDATE asignaturas SET asignatura = ?, version = ? WHERE id = ?", asignatura, nuevaVersion, id)

    // Obtener la asignatura actualizada
    const asignaturaActualizada = await db.get("SELECT * FROM asignaturas WHERE id = ?", id)

    // Obtener el user-agent
    const userAgent = request.headers.get("user-agent") || "";
    console.log("User-Agent:", userAgent);

    // Enviar al middleware si el user-agent no es del middleware
    if (userAgent !== "middleware") {
      await sendToMiddleware("/api/asignaturas", "PUT", { ...asignaturaActualizada, userAgent })
    }

    return NextResponse.json({ success: true, data: asignaturaActualizada })
  } catch (error) {
    console.error("Error al actualizar asignatura:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar asignatura" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Se requiere el ID de la asignatura" }, { status: 400 })
    }

    // Verificar si existe
    const asignatura = await db.get("SELECT * FROM asignaturas WHERE id = ?", id)
    if (!asignatura) {
      return NextResponse.json({ success: false, error: "Asignatura no encontrada" }, { status: 404 })
    }

    // Eliminar asignatura
    await db.run("DELETE FROM asignaturas WHERE id = ?", id)

    // Obtener el user-agent
    const userAgent = request.headers.get("user-agent") || "";
    console.log("User-Agent:", userAgent);

    // Enviar al middleware si el user-agent no es del middleware
    if (userAgent !== "middleware") {
      await sendToMiddleware("/api/asignaturas", "DELETE", { id, userAgent })
    }

    return NextResponse.json({ success: true, message: "Asignatura eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar asignatura:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar asignatura" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getDb, sendToMiddleware } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    // Obtenemos las matriculas y unimos las tablas necesarias para obtener el ciclo, el profesor, y el estudiante
    const matriculas = await db.all(`
     SELECT 
    m.id, 
    e.nombre AS estudiantes, 
    p.nombre AS profesores, 
    pc.ciclo AS ciclo, 
    a.asignatura, 
    m.nota1, 
    m.nota2, 
    m.sup, 
    m.version
FROM matriculas m
JOIN estudiantes e ON e.cedula = m.cedula_estudiante
JOIN profesores_ciclo pc ON pc.id = m.id_profesores_ciclo
JOIN profesores p ON p.cedula = pc.cedula
JOIN asignaturas a ON a.id = pc.id_asignaturas;


    `);
    return NextResponse.json({ success: true, data: matriculas });
  } catch (error) {
    console.error("Error al obtener matriculas:", error);
    return NextResponse.json({ success: false, error: "Error al obtener matriculas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const data = await request.json();
    const { id, cedula_estudiante, id_profesores_ciclo, nota1, nota2 } = data;

    // Validación de datos
    if (!id || !cedula_estudiante || !id_profesores_ciclo || nota1 === undefined || nota2 === undefined) {
      return NextResponse.json({ success: false, error: "ID, Cedula estudiante, id profesores ciclo, y las notas son obligatorios" }, { status: 400 });
    }

    // Verificar si ya existe la matrícula
    const existingMatricula = await db.get("SELECT * FROM matriculas WHERE cedula_estudiante = ? AND id_profesores_ciclo = ?", cedula_estudiante, id_profesores_ciclo);
    if (existingMatricula) {
      return NextResponse.json({ success: false, error: "La matrícula ya existe" }, { status: 400 });
    }

    // Calcular si es sup (aprobado o reprobado)
    const sup = (nota1 + nota2) / 2 < 7 ? 1 : 0;

    // Insertar nueva matrícula
    await db.run("INSERT INTO matriculas (id,cedula_estudiante, id_profesores_ciclo, nota1, nota2, sup, version) VALUES (?,?, ?, ?, ?, ?,1)", 
      id,cedula_estudiante, id_profesores_ciclo, nota1, nota2, sup);

    // Obtener la matrícula recién creada
    const nuevaMatricula = await db.get("SELECT * FROM matriculas WHERE cedula_estudiante = ? AND id_profesores_ciclo = ?", cedula_estudiante, id_profesores_ciclo);

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || "";
    if (userAgent !== "middleware") {
      await sendToMiddleware("/matriculas", "POST", { ...nuevaMatricula, userAgent });
    }

    return NextResponse.json({ success: true, data: nuevaMatricula }, { status: 201 });
  } catch (error) {
    console.error("Error al crear matrícula:", error);
    return NextResponse.json({ success: false, error: "Error al crear matrícula" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();
    const data = await request.json();
    const { id, cedula_estudiante, id_profesores_ciclo, nota1, nota2 } = data;

    // Validación de datos
    if (!id || !cedula_estudiante || !id_profesores_ciclo || nota1 === undefined || nota2 === undefined) {
      return NextResponse.json({ success: false, error: "ID, Cedula estudiante, id profesores ciclo, y las notas son obligatorios" }, { status: 400 });
    }

    // Verificar si existe la matrícula
    const matricula = await db.get("SELECT * FROM matriculas WHERE id = ?", id);
    if (!matricula) {
      return NextResponse.json({ success: false, error: "Matrícula no encontrada" }, { status: 404 });
    }

    // Calcular si es sup (aprobado o reprobado)
    const sup = (nota1 + nota2) / 2 < 7 ? 1 : 0;

    const nuevaVersion = matricula.version + 1


    // Actualizar matrícula
    await db.run("UPDATE matriculas SET nota1 = ?, nota2 = ?, sup = ?, version = ? WHERE id = ?", nota1, nota2, sup,nuevaVersion, id);

    // Obtener la matrícula actualizada
    const matriculaActualizada = await db.get("SELECT * FROM matriculas WHERE id = ?", id);

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || "";
    if (userAgent !== "middleware") {
      await sendToMiddleware("/matriculas", "PUT", { ...matriculaActualizada, userAgent });
    }

    return NextResponse.json({ success: true, data: matriculaActualizada });
  } catch (error) {
    console.error("Error al actualizar matrícula:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar matrícula" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Se requiere el ID de la matrícula" }, { status: 400 });
    }

    // Verificar si existe la matrícula
    const matricula = await db.get("SELECT * FROM matriculas WHERE id = ?", id);
    if (!matricula) {
      return NextResponse.json({ success: false, error: "Matrícula no encontrada" }, { status: 404 });
    }

    // Eliminar matrícula
    await db.run("DELETE FROM matriculas WHERE id = ?", id);

    // Enviar al middleware si el user-agent no es del middleware
    const userAgent = request.headers.get("user-agent") || "";
    if (userAgent !== "middleware") {
      await sendToMiddleware("/matriculas", "DELETE", { id, userAgent });
    }

    return NextResponse.json({ success: true, message: "Matrícula eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar matrícula:", error);
    return NextResponse.json({ success: false, error: "Error al eliminar matrícula" }, { status: 500 });
  }
}

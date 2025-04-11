import sqlite3 from "sqlite3"
import { open, type Database } from "sqlite"
import path from "path"
import fs from "fs"

// Variable global para la base de datos
let db: Database | null = null

// Ruta donde se almacenará la base de datos
const dbPath = path.resolve("db", "database.sqlite")

// Asegurarse de que el directorio exista
if (!fs.existsSync("db")) {
  fs.mkdirSync("db")
}

// Inicializa la base de datos SQLite
async function initializeDb() {
  try {
    console.log("Inicializando base de datos en archivo local...")

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    console.log("Base de datos abierta en:", dbPath)

    // Crear tablas si no existen
    await db.exec(`
      CREATE TABLE IF NOT EXISTS profesores (
        cedula TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        version INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS asignaturas (
        id TEXT PRIMARY KEY,
        asignatura TEXT NOT NULL,
        version INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS profesores_ciclo (
        id TEXT PRIMARY KEY,
        cedula TEXT NOT NULL,
        id_asignaturas TEXT NOT NULL,
        ciclo TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        FOREIGN KEY (cedula) REFERENCES profesores(cedula),
        FOREIGN KEY (id_asignaturas) REFERENCES asignaturas(id)
      );

      CREATE TABLE IF NOT EXISTS estudiantes (
        cedula TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        version INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS matriculas (
        id TEXT PRIMARY KEY,
        cedula_estudiante TEXT NOT NULL,
        id_profesores_ciclo TEXT NOT NULL,
        nota1 REAL DEFAULT 0,
        nota2 REAL DEFAULT 0,
        sup INTEGER DEFAULT 0,
        version INTEGER DEFAULT 1,
        FOREIGN KEY (cedula_profesores_ciclo) REFERENCES profesores_ciclo(id),
        FOREIGN KEY (cedula_estudiante) REFERENCES estudiantes(cedula)
      );
    `)

    console.log("Tablas creadas/verificadas correctamente")
    return db
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    throw error
  }
}

// Exporta la conexión a la base de datos
export async function getDb(): Promise<Database> {
  if (!db) {
    db = await initializeDb()
  }
  return db
}

// Cierra la conexión a la base de datos
export async function closeDb() {
  if (db) {
    try {
      await db.close()
      db = null
      console.log("Conexión a la base de datos cerrada")
    } catch (error) {
      console.error("Error al cerrar la base de datos:", error)
    }
  }
}

// Función para enviar datos al middleware
export async function sendToMiddleware(endpoint: string, method: string, data: any) {
  try {
    if (data.userAgent === "middleware") {
      console.log("Petición del middleware detectada. No se reenvía.")
      return
    }

    const middlewareUrl = process.env.MIDDLEWARE_URL || "http://localhost:3001/api"

    if (!middlewareUrl) {
      console.warn("MIDDLEWARE_URL no está configurada. Omitiendo replicación.")
      return
    }

    console.log(`Reenviando a middleware: ${middlewareUrl}${endpoint}...`)

    const response = await fetch(`${middlewareUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "middleware", // para evitar reenvío en cadena
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error al enviar al middleware: ${response.status} ${response.statusText}`)
    }

    console.log("✅ Petición replicada correctamente al middleware.")
  } catch (error) {
    console.error("❌ Error en replicación al middleware:", error)
  }

  
}


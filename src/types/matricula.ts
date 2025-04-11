export interface Matricula {
    id: string
    cedula_estudiante: string
    id_profesores_ciclo: string
    nota1: number
    nota2: number
    sup: number
    version: number
  }
  
  export interface MatriculaDetalle extends Matricula {
    estudiantes: string
    profesores: string
    ciclo: string
    asignatura: string
  }
  
  
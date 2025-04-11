export interface ProfesorCicloInput {
    id: string
    cedula: string
    id_asignaturas: string
    ciclo: string
  }
  
  export interface ProfesorCicloDetalle {
    id: string
    profesor: string
    asignatura: string
    ciclo: string
    version: number
  }
  
  export interface ProfesorCiclo {
    id: string
    cedula: string
    id_asignaturas: string
    ciclo: string
    version: number
  }
export interface Nivel {
  id: number
  nombre: string
  material: string
  descripcion: string
  puntosBase: number
  velocidadTallado: number
}

export interface Logro {
  id: string
  nombre: string
  desc: string
}

export const NIVELES: Nivel[] = [
  {
    id: 1,
    nombre: "Desbastado de CR-39",
    material: "CR-39",
    descripcion: "Material estándar. Ideal para principiantes.",
    puntosBase: 50,
    velocidadTallado: 1,
  },
  {
    id: 2,
    nombre: "Tallado de Policarbonato",
    material: "Policarbonato",
    descripcion: "Material más duro. Mayor precisión requerida.",
    puntosBase: 100,
    velocidadTallado: 0.8,
  },
  {
    id: 3,
    nombre: "Pulido de Trivex",
    material: "Trivex",
    descripcion: "Material de alto desempeño. Experto requerido.",
    puntosBase: 150,
    velocidadTallado: 0.6,
  },
  {
    id: 4,
    nombre: "Corte de Vidrio óptico",
    material: "Vidrio óptico",
    descripcion: "Máxima dificultad. Solo para maestros.",
    puntosBase: 250,
    velocidadTallado: 0.4,
  },
]

export const LOGROS: Record<string, Omit<Logro, "id">> = {
  "primera-lente": { nombre: "Primera Lente", desc: "Completa tu primer tallado" },
  "maestro-cr39": { nombre: "Maestro CR-39", desc: "Domina 5 lentes de CR-39" },
  "racha-5": { nombre: "Racha de 5", desc: "Completa 5 lentes seguidos" },
  "puntos-500": { nombre: "500 Puntos", desc: "Acumula 500 puntos" },
  "nivel-2": { nombre: "Ascenso", desc: "Alcanza el Nivel 2" },
  "nivel-3": { nombre: "Veterano", desc: "Alcanza el Nivel 3" },
  "nivel-4": { nombre: "Maestro Absoluto", desc: "Alcanza el Nivel 4" },
  perfecta: { nombre: "Lente Perfecta", desc: "Logra 100% de precisión" },
}

export interface SavedState {
  puntos: number
  nivel: number
  racha: number
  logros: string[]
  talladosCompletados: number
}

export const STORAGE_KEY = "optiskill-state"
export const USERNAME_KEY = "optiskill-username"

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  NIVELES,
  LOGROS,
  STORAGE_KEY,
  USERNAME_KEY,
  type SavedState,
} from "@/lib/game-data"

export interface ToastLogro {
  key: number
  nombre: string
  desc: string
}

export type LogType = "info" | "success" | "error"

export function useGame() {
  const [nombre, setNombre] = useState("INVITADO")
  const [needsName, setNeedsName] = useState(false)
  const [puntos, setPuntos] = useState(0)
  const [nivel, setNivel] = useState(1)
  const [racha, setRacha] = useState(0)
  const [progreso, setProgreso] = useState(0)
  const [isTallando, setIsTallando] = useState(false)
  const [logros, setLogros] = useState<Set<string>>(new Set())
  const [talladosCompletados, setTalladosCompletados] = useState(0)
  const [log, setLog] = useState({ text: "Esperando inicio de proceso...", type: "info" as LogType })
  const [toasts, setToasts] = useState<ToastLogro[]>([])
  const [ascenso, setAscenso] = useState<{ nivel: number; nombre: string; descripcion: string } | null>(null)
  const [loaded, setLoaded] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progresoRef = useRef(0)
  const toastId = useRef(0)

  // Refs to access latest values inside callbacks
  const stateRef = useRef({ puntos, nivel, racha, talladosCompletados, logros })
  stateRef.current = { puntos, nivel, racha, talladosCompletados, logros }

  // Load from storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem(USERNAME_KEY)
    if (savedName) {
      setNombre(savedName.toUpperCase())
    } else {
      setNeedsName(true)
    }

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data: SavedState = JSON.parse(saved)
        setPuntos(data.puntos || 0)
        setNivel(data.nivel || 1)
        setRacha(data.racha || 0)
        setLogros(new Set(data.logros || []))
        setTalladosCompletados(data.talladosCompletados || 0)
      } catch {
        // ignore corrupt data
      }
    }
    setLoaded(true)
  }, [])

  const persist = useCallback(
    (partial: Partial<SavedState>) => {
      const s = stateRef.current
      const data: SavedState = {
        puntos: s.puntos,
        nivel: s.nivel,
        racha: s.racha,
        logros: Array.from(s.logros),
        talladosCompletados: s.talladosCompletados,
        ...partial,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    },
    [],
  )

  const guardarNombre = useCallback((value: string) => {
    const finalName = (value.trim() || "INVITADO").toUpperCase()
    localStorage.setItem(USERNAME_KEY, finalName)
    setNombre(finalName)
    setNeedsName(false)
  }, [])

  const desbloquearLogro = useCallback((id: string) => {
    setLogros((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      const logro = LOGROS[id]
      if (logro) {
        const key = toastId.current++
        setToasts((t) => [...t, { key, nombre: logro.nombre, desc: logro.desc }])
        setTimeout(() => {
          setToasts((t) => t.filter((toast) => toast.key !== key))
        }, 5000)
      }
      return next
    })
  }, [])

  const startTallado = useCallback(() => {
    if (intervalRef.current) return
    setIsTallando(true)
    setLog({ text: "Tallando... Mantén la presión constante.", type: "info" })

    const nivelConfig = NIVELES[stateRef.current.nivel - 1]
    intervalRef.current = setInterval(() => {
      progresoRef.current = Math.min(progresoRef.current + nivelConfig.velocidadTallado, 100)
      setProgreso(progresoRef.current)
    }, 50)
  }, [])

  const stopTallado = useCallback(() => {
    setIsTallando(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setLog({ text: "Proceso pausado. Revisa la superficie.", type: "info" })
  }, [])

  const resetLente = useCallback(() => {
    progresoRef.current = 0
    setProgreso(0)
    setLog({ text: "Lente reiniciada. ¡Comienza de nuevo!", type: "info" })
  }, [])

  const completarPrueba = useCallback(() => {
    const precision = Math.floor(progresoRef.current)
    const s = stateRef.current
    const nivelConfig = NIVELES[s.nivel - 1]

    if (precision < 90) {
      setLog({
        text: `Lente incompleta (${precision}%). Necesitas mínimo 90%.`,
        type: "error",
      })
      setRacha(0)
      persist({ racha: 0 })
      return
    }

    let puntosGanados = nivelConfig.puntosBase
    if (precision === 100) puntosGanados *= 1.5
    puntosGanados += s.racha * 10
    puntosGanados = Math.floor(puntosGanados)

    const nuevosPuntos = s.puntos + puntosGanados
    const nuevaRacha = s.racha + 1
    const nuevosTallados = s.talladosCompletados + 1

    setPuntos(nuevosPuntos)
    setRacha(nuevaRacha)
    setTalladosCompletados(nuevosTallados)

    let mensaje = `Lente completada (${precision}%). +${puntosGanados} pts.`
    if (precision === 100) mensaje += " ¡PERFECCIÓN!"
    if (nuevaRacha > 1) mensaje += ` Racha x${nuevaRacha}`
    setLog({ text: mensaje, type: "success" })

    // Logros (usar valores nuevos)
    if (nuevosTallados === 1) desbloquearLogro("primera-lente")
    if (s.nivel === 1 && nuevosTallados >= 5) desbloquearLogro("maestro-cr39")
    if (nuevaRacha >= 5) desbloquearLogro("racha-5")
    if (nuevosPuntos >= 500) desbloquearLogro("puntos-500")
    if (precision === 100) desbloquearLogro("perfecta")

    // Ascenso de nivel
    let nivelFinal = s.nivel
    if (nuevosPuntos >= 100 * s.nivel && s.nivel < NIVELES.length) {
      nivelFinal = s.nivel + 1
      setNivel(nivelFinal)
      const nuevoNivel = NIVELES[nivelFinal - 1]
      setAscenso({
        nivel: nivelFinal,
        nombre: nuevoNivel.nombre,
        descripcion: nuevoNivel.descripcion,
      })
      desbloquearLogro("nivel-" + nivelFinal)
    }

    persist({
      puntos: nuevosPuntos,
      racha: nuevaRacha,
      talladosCompletados: nuevosTallados,
      nivel: nivelFinal,
    })

    setTimeout(() => resetLente(), 2000)
  }, [desbloquearLogro, persist, resetLente])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const cerrarAscenso = useCallback(() => setAscenso(null), [])

  return {
    nombre,
    needsName,
    puntos,
    nivel,
    racha,
    progreso,
    isTallando,
    logros,
    log,
    toasts,
    ascenso,
    loaded,
    guardarNombre,
    startTallado,
    stopTallado,
    resetLente,
    completarPrueba,
    cerrarAscenso,
  }
}

"use client"

// Generación de sonido con Web Audio API (sin archivos externos).
let ctx: AudioContext | null = null
let grindNodes: { osc: OscillatorNode; noise: AudioBufferSourceNode; gain: GainNode } | null = null

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === "suspended") void ctx.resume()
  return ctx
}

function createNoiseBuffer(audio: AudioContext): AudioBuffer {
  const bufferSize = audio.sampleRate * 2
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

// Sonido continuo de tallado/esmerilado mientras se mantiene presionado.
export function startGrind() {
  const audio = getCtx()
  if (!audio || grindNodes) return

  const gain = audio.createGain()
  gain.gain.value = 0
  gain.gain.linearRampToValueAtTime(0.08, audio.currentTime + 0.1)
  gain.connect(audio.destination)

  // Componente de ruido (fricción)
  const noise = audio.createBufferSource()
  noise.buffer = createNoiseBuffer(audio)
  noise.loop = true
  const noiseFilter = audio.createBiquadFilter()
  noiseFilter.type = "bandpass"
  noiseFilter.frequency.value = 900
  noiseFilter.Q.value = 0.7
  noise.connect(noiseFilter)
  noiseFilter.connect(gain)
  noise.start()

  // Componente tonal (motor)
  const osc = audio.createOscillator()
  osc.type = "sawtooth"
  osc.frequency.value = 70
  const oscGain = audio.createGain()
  oscGain.gain.value = 0.4
  osc.connect(oscGain)
  oscGain.connect(gain)
  osc.start()

  grindNodes = { osc, noise, gain }
}

export function stopGrind() {
  const audio = getCtx()
  if (!audio || !grindNodes) return
  const { osc, noise, gain } = grindNodes
  gain.gain.cancelScheduledValues(audio.currentTime)
  gain.gain.linearRampToValueAtTime(0, audio.currentTime + 0.08)
  setTimeout(() => {
    try {
      osc.stop()
      noise.stop()
    } catch {
      // ya detenido
    }
  }, 120)
  grindNodes = null
}

// Tono corto para eventos (éxito / error).
export function playTone(type: "success" | "error") {
  const audio = getCtx()
  if (!audio) return
  const now = audio.currentTime
  const gain = audio.createGain()
  gain.connect(audio.destination)

  if (type === "success") {
    // Arpegio ascendente
    const freqs = [523.25, 659.25, 783.99]
    freqs.forEach((f, i) => {
      const osc = audio.createOscillator()
      osc.type = "triangle"
      osc.frequency.value = f
      const g = audio.createGain()
      g.gain.setValueAtTime(0, now + i * 0.1)
      g.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.25)
      osc.connect(g)
      g.connect(audio.destination)
      osc.start(now + i * 0.1)
      osc.stop(now + i * 0.1 + 0.25)
    })
  } else {
    const osc = audio.createOscillator()
    osc.type = "square"
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.3)
  }
}

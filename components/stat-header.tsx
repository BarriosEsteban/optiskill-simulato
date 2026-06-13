interface StatHeaderProps {
  nombre: string
  nivel: number
  puntos: number
  racha: number
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 min-w-[100px] rounded-lg border border-[var(--primary)] bg-[rgba(0,212,255,0.05)] px-4 py-3 text-center">
      <span className="block text-xs font-medium uppercase tracking-wider text-[#9aa0b4]">
        {label}
      </span>
      <span className="mt-1 block text-2xl font-bold text-[var(--primary)] [text-shadow:0_0_10px_rgba(0,212,255,0.5)]">
        {value}
      </span>
    </div>
  )
}

export function StatHeader({ nombre, nivel, puntos, racha }: StatHeaderProps) {
  return (
    <header className="flex w-full flex-wrap justify-around gap-4 border-b-[3px] border-[var(--primary)] bg-[rgba(45,45,68,0.95)] p-5 shadow-[0_4px_25px_rgba(0,212,255,0.2)]">
      <StatBox label="Tallador" value={nombre} />
      <StatBox label="Nivel" value={nivel} />
      <StatBox label="Puntos" value={puntos} />
      <StatBox label="Racha" value={racha} />
    </header>
  )
}

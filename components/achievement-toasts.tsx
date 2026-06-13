"use client"

import type { ToastLogro } from "@/hooks/use-game"

export function AchievementToasts({ toasts }: { toasts: ToastLogro[] }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.key}
          className="achievement-card max-w-xs rounded-lg border-2 border-[var(--accent)] bg-[rgba(255,0,123,0.12)] px-5 py-3 shadow-[0_4px_20px_rgba(255,0,123,0.25)] backdrop-blur"
        >
          <p className="text-sm font-bold text-[var(--accent)]">{t.nombre}</p>
          <p className="text-xs text-[#c9cde0]">{t.desc}</p>
        </div>
      ))}
    </div>
  )
}

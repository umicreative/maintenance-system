import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'signal',
}: {
  label: string
  value: number | string
  icon: LucideIcon
  accent?: 'signal' | 'ok' | 'alert'
}) {
  const accentStyles = {
    signal: 'bg-signal-500/15 text-signal-400',
    ok: 'bg-ok-500/15 text-ok-500',
    alert: 'bg-alert-500/15 text-alert-500',
  }[accent]

  return (
    <div className="panel flex items-center gap-4 p-5">
      <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', accentStyles)}>
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums text-ink-100">{value}</p>
        <p className="text-sm text-ink-400">{label}</p>
      </div>
    </div>
  )
}

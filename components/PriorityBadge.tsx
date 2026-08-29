import clsx from 'clsx'
import type { TaskPriority } from '@/types'

const styles: Record<TaskPriority, string> = {
  Low: 'bg-ink-700 text-ink-200 border-ink-600',
  Medium: 'bg-signal-500/15 text-signal-400 border-signal-500/30',
  High: 'bg-alert-500/15 text-alert-500 border-alert-500/30',
}

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        styles[priority]
      )}
    >
      {priority}
    </span>
  )
}

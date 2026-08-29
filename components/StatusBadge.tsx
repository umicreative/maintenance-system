import clsx from 'clsx'
import type { TaskStatus } from '@/types'

const styles: Record<TaskStatus, string> = {
  Pending: 'bg-ink-700 text-ink-200 border-ink-600',
  'In Progress': 'bg-signal-500/15 text-signal-400 border-signal-500/30',
  Completed: 'bg-ok-500/15 text-ok-500 border-ok-500/30',
}

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        styles[status]
      )}
    >
      {status}
    </span>
  )
}

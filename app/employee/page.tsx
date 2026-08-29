'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Task, TaskStatus } from '@/types'
import PriorityBadge from '@/components/PriorityBadge'
import StatusBadge from '@/components/StatusBadge'
import { ClipboardList, X } from 'lucide-react'
import clsx from 'clsx'

const STATUS_FLOW: TaskStatus[] = ['Pending', 'In Progress', 'Completed']

export default function EmployeeDashboard() {
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Task | null>(null)

  async function loadTasks() {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_employee_id', user.id)
      .order('created_at', { ascending: false })

    setTasks(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function updateStatus(task: Task, status: TaskStatus) {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', task.id)
    if (!error) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)))
      setSelected((prev) => (prev ? { ...prev, status } : prev))
    }
  }

  const grouped = {
    Pending: tasks.filter((t) => t.status === 'Pending'),
    'In Progress': tasks.filter((t) => t.status === 'In Progress'),
    Completed: tasks.filter((t) => t.status === 'Completed'),
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-100">My tasks</h1>
        <p className="mt-1 text-sm text-ink-400">Work orders assigned to you.</p>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-ink-400">Loading…</p>
      ) : tasks.length === 0 ? (
        <div className="panel flex flex-col items-center gap-3 py-16 text-center">
          <ClipboardList className="h-8 w-8 text-ink-500" />
          <p className="text-sm text-ink-400">No tasks assigned to you yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.keys(grouped) as TaskStatus[]).map((status) =>
            grouped[status].length === 0 ? null : (
              <div key={status}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {status} — {grouped[status].length}
                </h2>
                <div className="space-y-2">
                  {grouped[status].map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelected(task)}
                      className="panel flex w-full items-center justify-between gap-4 p-4 text-left transition hover:border-ink-500"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink-100">{task.title}</p>
                        {task.description && (
                          <p className="mt-0.5 truncate text-xs text-ink-400">{task.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {selected && (
        <TaskDetailModal task={selected} onClose={() => setSelected(null)} onUpdateStatus={updateStatus} />
      )}
    </div>
  )
}

function TaskDetailModal({
  task,
  onClose,
  onUpdateStatus,
}: {
  task: Task
  onClose: () => void
  onUpdateStatus: (task: Task, status: TaskStatus) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="panel w-full max-w-md p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-ink-100">{task.title}</h2>
          <button onClick={onClose} className="shrink-0 text-ink-400 hover:text-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 flex gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>

        {task.description && (
          <p className="mb-6 text-sm leading-relaxed text-ink-300">{task.description}</p>
        )}

        <p className="label-field">Update status</p>
        <div className="flex gap-2">
          {STATUS_FLOW.map((status) => (
            <button
              key={status}
              onClick={() => onUpdateStatus(task, status)}
              className={clsx(
                'flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition',
                task.status === status
                  ? 'border-signal-500 bg-signal-500/15 text-signal-400'
                  : 'border-ink-600 bg-ink-800 text-ink-300 hover:bg-ink-700'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
    }

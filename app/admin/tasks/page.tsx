'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Task, Profile, TaskPriority } from '@/types'
import PriorityBadge from '@/components/PriorityBadge'
import StatusBadge from '@/components/StatusBadge'
import { Plus, X, TriangleAlert } from 'lucide-react'

export default function AdminTasksPage() {
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  async function loadData() {
    setLoading(true)
    const [{ data: taskData }, { data: empData }] = await Promise.all([
      supabase
        .from('tasks')
        .select('*, assigned_employee:assigned_employee_id(id, name, email)')
        .order('created_at', { ascending: false }),
      supabase.from('users').select('*').eq('role', 'employee').eq('is_active', true).order('name'),
    ])
    setTasks((taskData as any) ?? [])
    setEmployees(empData ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Work orders</h1>
          <p className="mt-1 text-sm text-ink-400">Create and assign maintenance tasks.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New work order
        </button>
      </div>

      <div className="panel overflow-hidden">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-ink-400">Loading…</p>
        ) : tasks.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-400">
            No work orders yet. Create one to assign it to an employee.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-xs uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Assigned to</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-ink-800 last:border-0 align-top">
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink-100">{task.title}</p>
                    {task.description && (
                      <p className="mt-0.5 max-w-sm text-xs text-ink-400">{task.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink-300">
                    {task.assigned_employee?.name ?? 'Unassigned'}
                  </td>
                  <td className="px-5 py-3">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={task.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <NewTaskModal
          employees={employees}
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}

function NewTaskModal({
  employees,
  onClose,
  onCreated,
}: {
  employees: Profile[]
  onClose: () => void
  onCreated: () => void
}) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('tasks').insert({
      title,
      description: description || null,
      priority,
      assigned_employee_id: assignedTo || null,
      created_by: user?.id ?? null,
    })

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    onCreated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="panel w-full max-w-md p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-100">New work order</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Title</label>
            <input
              required
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Replace HVAC filter — Building B"
            />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be done, and any relevant details…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Priority</label>
              <select
                className="input-field"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="label-field">Assign to</label>
              <select
                required
                className="input-field"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="" disabled>
                  Select employee
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-alert-500/30 bg-alert-500/10 px-3 py-2.5 text-sm text-alert-500">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Creating…' : 'Create work order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
  }

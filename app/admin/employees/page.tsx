'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import { UserPlus, X, TriangleAlert, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

export default function EmployeesPage() {
  const supabase = createClient()
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  async function loadEmployees() {
    setLoading(true)
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
    setEmployees(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  async function toggleActive(employee: Profile) {
    await fetch('/api/employees', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: employee.id, is_active: !employee.is_active }),
    })
    loadEmployees()
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Employees</h1>
          <p className="mt-1 text-sm text-ink-400">Hire staff and manage who has access.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <UserPlus className="h-4 w-4" /> Register employee
        </button>
      </div>

      <div className="panel overflow-hidden">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-ink-400">Loading…</p>
        ) : employees.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-400">No staff registered yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-xs uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-ink-800 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-100">{emp.name}</td>
                  <td className="px-5 py-3 text-ink-300">{emp.email}</td>
                  <td className="px-5 py-3 text-ink-300">
                    {emp.role === 'super_admin' ? 'Super Admin' : 'Employee'}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={clsx(
                        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                        emp.is_active
                          ? 'border-ok-500/30 bg-ok-500/15 text-ok-500'
                          : 'border-ink-600 bg-ink-700 text-ink-300'
                      )}
                    >
                      {emp.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => toggleActive(emp)}
                      className="text-xs font-semibold text-ink-300 underline decoration-ink-600 underline-offset-2 hover:text-ink-100"
                    >
                      {emp.is_active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <RegisterEmployeeModal
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false)
            loadEmployees()
          }}
        />
      )}
    </div>
  )
}

function RegisterEmployeeModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'employee' | 'super_admin'>('employee')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    })
    const body = await res.json()

    if (!res.ok) {
      setError(body.error ?? 'Something went wrong')
      setSubmitting(false)
      return
    }

    onCreated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="panel w-full max-w-md p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-100">Register employee</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Full name</label>
            <input
              required
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Reyes"
            />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input
              required
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@company.com"
            />
          </div>
          <div>
            <label className="label-field">Temporary password</label>
            <input
              required
              type="password"
              minLength={8}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="label-field">Role</label>
            <select
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value as 'employee' | 'super_admin')}
            >
              <option value="employee">Employee</option>
              <option value="super_admin">Super Admin</option>
            </select>
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
              {submitting ? 'Creating…' : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Create account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
                              }

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MaintenanceRequest, RequestStatus } from '@/types'
import { Plus, X, TriangleAlert, FileText } from 'lucide-react'
import clsx from 'clsx'

const statusStyles: Record<RequestStatus, string> = {
  Submitted: 'bg-ink-700 text-ink-200 border-ink-600',
  'In Review': 'bg-signal-500/15 text-signal-400 border-signal-500/30',
  Converted: 'bg-ok-500/15 text-ok-500 border-ok-500/30',
  Declined: 'bg-alert-500/15 text-alert-500 border-alert-500/30',
}

export default function ClientDashboard() {
  const supabase = createClient()
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  async function loadRequests() {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('requests')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
    setRequests(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">My requests</h1>
          <p className="mt-1 text-sm text-ink-400">Submit and track maintenance requests.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New request
        </button>
      </div>

      <div className="panel overflow-hidden">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-ink-400">Loading…</p>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="h-8 w-8 text-ink-500" />
            <p className="text-sm text-ink-400">You haven't submitted any requests yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-ink-800">
            {requests.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-100">{r.title}</p>
                  {r.description && (
                    <p className="mt-0.5 truncate text-xs text-ink-400">{r.description}</p>
                  )}
                </div>
                <span
                  className={clsx(
                    'shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                    statusStyles[r.status]
                  )}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showForm && (
        <NewRequestModal
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false)
            loadRequests()
          }}
        />
      )}
    </div>
  )
}

function NewRequestModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('requests').insert({
      client_id: user?.id,
      title,
      description: description || null,
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
          <h2 className="text-lg font-bold text-ink-100">New request</h2>
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
              placeholder="Leaking faucet in break room"
            />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any relevant details…"
            />
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
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
    }

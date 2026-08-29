'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import { UserCheck, UserX, Clock } from 'lucide-react'

export default function ApprovalsPage() {
  const supabase = createClient()
  const [pending, setPending] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'employee')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: true })
    setPending(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function decide(id: string, decision: 'approved' | 'rejected') {
    await supabase.from('users').update({ approval_status: decision }).eq('id', id)
    load()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-100">Employee approvals</h1>
        <p className="mt-1 text-sm text-ink-400">Review accounts that signed up as employees.</p>
      </div>

      <div className="panel overflow-hidden">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-ink-400">Loading…</p>
        ) : pending.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Clock className="h-8 w-8 text-ink-500" />
            <p className="text-sm text-ink-400">No pending approvals right now.</p>
          </div>
        ) : (
          <ul className="divide-y divide-ink-800">
            {pending.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-100">{p.name}</p>
                  <p className="truncate text-xs text-ink-400">{p.email}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => decide(p.id, 'approved')}
                    className="flex items-center gap-1.5 rounded-lg border border-ok-500/30 bg-ok-500/15 px-3 py-2 text-xs font-semibold text-ok-500 hover:bg-ok-500/25"
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => decide(p.id, 'rejected')}
                    className="flex items-center gap-1.5 rounded-lg border border-alert-500/30 bg-alert-500/15 px-3 py-2 text-xs font-semibold text-alert-500 hover:bg-alert-500/25"
                  >
                    <UserX className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
      }

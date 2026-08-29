import { createClient } from '@/lib/supabase/server'
import StatCard from '@/components/StatCard'
import PriorityBadge from '@/components/PriorityBadge'
import StatusBadge from '@/components/StatusBadge'
import { Users, ClipboardList, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  const supabase = createClient()

  const [{ count: employeeCount }, { count: activeCount }, { count: completedCount }, { data: recentTasks }] =
    await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'employee').eq('is_active', true),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).neq('status', 'Completed'),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'Completed'),
      supabase
        .from('tasks')
        .select('id, title, status, priority, created_at, assigned_employee:assigned_employee_id(id, name)')
        .order('created_at', { ascending: false })
        .limit(6),
    ])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Overview</h1>
          <p className="mt-1 text-sm text-ink-400">A snapshot of your maintenance operation.</p>
        </div>
        <Link href="/admin/tasks" className="btn-primary">
          + New work order
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active employees" value={employeeCount ?? 0} icon={Users} accent="signal" />
        <StatCard label="Active work orders" value={activeCount ?? 0} icon={ClipboardList} accent="alert" />
        <StatCard label="Completed work orders" value={completedCount ?? 0} icon={CheckCircle2} accent="ok" />
      </div>

      <div className="panel overflow-hidden">
        <div className="border-b border-ink-700 px-5 py-4">
          <h2 className="text-sm font-semibold text-ink-100">Recent work orders</h2>
        </div>
        {!recentTasks || recentTasks.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-400">
            No work orders yet. Create your first one to get started.
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
              {recentTasks.map((task: any) => (
                <tr key={task.id} className="border-b border-ink-800 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-100">{task.title}</td>
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
    </div>
  )
                                                                             }

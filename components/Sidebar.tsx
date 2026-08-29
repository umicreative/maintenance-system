'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ListChecks,
  Wrench,
  LogOut,
} from 'lucide-react'
import type { Profile } from '@/types'

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/tasks', label: 'Work Orders', icon: ClipboardList },
]

const employeeLinks = [{ href: '/employee', label: 'My Tasks', icon: ListChecks }]

export default function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const links = profile.role === 'super_admin' ? adminLinks : employeeLinks

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-ink-700 bg-ink-900">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-500">
          <Wrench className="h-4 w-4 text-ink-950" strokeWidth={2.5} />
        </div>
        <span className="text-base font-bold tracking-tight text-ink-100">UpKeep</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const active = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'bg-signal-500/15 text-signal-400'
                  : 'text-ink-300 hover:bg-ink-800 hover:text-ink-100'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-ink-700 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-700 text-xs font-bold text-ink-100">
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-100">{profile.name}</p>
            <p className="truncate text-xs text-ink-400">
              {profile.role === 'super_admin' ? 'Super Admin' : 'Employee'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-ink-800 hover:text-alert-500"
        >
          <LogOut className="h-4 w-4" strokeWidth={2.25} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

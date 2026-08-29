import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  if (!profile) redirect('/login')

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar profile={profile} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}

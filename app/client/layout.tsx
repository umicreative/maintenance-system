import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  if (!profile) redirect('/login')
  if (profile.role !== 'client') redirect(profile.role === 'super_admin' ? '/admin' : '/employee')

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar profile={profile} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}

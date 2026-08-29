'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthShell from '@/components/AuthShell'
import { Clock, LogOut } from 'lucide-react'

export default function PendingPage() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <AuthShell eyebrow="Almost there">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15">
          <Clock className="h-6 w-6 text-violet-400" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-white">Awaiting approval</h2>
        <p className="text-sm text-navy-500">
          Your employee account is verified but still needs to be approved by a Super Admin.
          You'll be able to sign in as soon as that happens.
        </p>
        <button onClick={handleSignOut} className="btn-auth-secondary mt-6">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </AuthShell>
  )
        }

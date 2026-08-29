'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthShell from '@/components/AuthShell'
import { TriangleAlert, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role, approval_status')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'employee' && profile.approval_status === 'pending') {
      router.push('/pending')
    } else if (profile?.role === 'super_admin') {
      router.push('/admin')
    } else if (profile?.role === 'client') {
      router.push('/client')
    } else {
      router.push('/employee')
    }
    router.refresh()
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
  }

  return (
    <AuthShell eyebrow="Welcome back">
      <h2 className="mb-1 text-lg font-bold text-white">Sign in</h2>
      <p className="mb-6 text-sm text-navy-500">Access your maintenance dashboard.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="auth-input"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="auth-label">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-alert-500/30 bg-alert-500/10 px-3 py-2.5 text-sm text-alert-500">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-auth-primary">
          {loading ? 'Signing in…' : (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-navy-500">or continue with</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button onClick={handleGoogle} className="btn-auth-secondary">
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.89c2.28-2.1 3.57-5.19 3.57-8.81z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3.01c-1.08.72-2.45 1.15-4.04 1.15-3.11 0-5.74-2.1-6.68-4.92H1.3v3.1C3.27 21.3 7.31 24 12 24z"/>
          <path fill="#FBBC05" d="M5.32 14.31A7.2 7.2 0 0 1 4.94 12c0-.8.14-1.58.38-2.31v-3.1H1.3A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.3 5.41l4.02-3.1z"/>
          <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.3 6.59l4.02 3.1c.94-2.82 3.57-4.92 6.68-4.92z"/>
        </svg>
        Sign in with Google
      </button>

      <p className="mt-6 text-center text-sm text-navy-500">
        New here?{' '}
        <Link href="/signup" className="font-semibold text-teal-400 hover:text-teal-300">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
          }

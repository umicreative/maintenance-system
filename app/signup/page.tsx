'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthShell from '@/components/AuthShell'
import { TriangleAlert, CheckCircle2, Briefcase, UserRound } from 'lucide-react'
import clsx from 'clsx'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [role, setRole] = useState<'client' | 'employee'>('client')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <AuthShell eyebrow="Almost there">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/15">
            <CheckCircle2 className="h-6 w-6 text-teal-400" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-white">Check your email</h2>
          <p className="text-sm text-navy-500">
            We sent a confirmation link to <span className="text-white">{email}</span>.
            Follow it to verify your account.
            {role === 'employee' && (
              <> After that, a Super Admin still needs to approve your employee access before you can sign in.</>
            )}
          </p>
          <Link href="/login" className="btn-auth-secondary mt-6">
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell eyebrow="Get started">
      <h2 className="mb-1 text-lg font-bold text-white">Create your account</h2>
      <p className="mb-6 text-sm text-navy-500">Choose how you'll use UpKeep.</p>

      <div className="mb-5 flex gap-3">
        <button
          type="button"
          onClick={() => setRole('client')}
          className={clsx(
            'role-pill',
            role === 'client'
              ? 'border-teal-500 bg-teal-500/10 text-teal-300'
              : 'border-white/10 bg-white/5 text-navy-500 hover:border-white/20'
          )}
        >
          <UserRound className="mx-auto mb-1.5 h-5 w-5" />
          I'm a Client
        </button>
        <button
          type="button"
          onClick={() => setRole('employee')}
          className={clsx(
            'role-pill',
            role === 'employee'
              ? 'border-violet-500 bg-violet-500/10 text-violet-300'
              : 'border-white/10 bg-white/5 text-navy-500 hover:border-white/20'
          )}
        >
          <Briefcase className="mx-auto mb-1.5 h-5 w-5" />
          I'm an Employee
        </button>
      </div>

      {role === 'employee' && (
        <p className="mb-5 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3.5 py-2.5 text-xs text-violet-300">
          Employee accounts need approval from a Super Admin before you can sign in.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="auth-label">Full name</label>
          <input
            required
            className="auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jordan Reyes"
          />
        </div>
        <div>
          <label className="auth-label">Email</label>
          <input
            required
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="auth-label">Password</label>
          <input
            required
            type="password"
            minLength={8}
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-alert-500/30 bg-alert-500/10 px-3 py-2.5 text-sm text-alert-500">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-auth-primary">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-teal-400 hover:text-teal-300">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}

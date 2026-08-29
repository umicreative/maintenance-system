import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getCurrentProfile } from '@/lib/supabase/server'

function getAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: Request) {
  const requester = await getCurrentProfile()
  if (!requester || requester.role !== 'super_admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const { name, email, password, role } = await request.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const admin = getAdminClient()

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role: role === 'super_admin' ? 'super_admin' : 'employee' },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user: data.user })
}

export async function PATCH(request: Request) {
  const requester = await getCurrentProfile()
  if (!requester || requester.role !== 'super_admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const { id, is_active } = await request.json()
  const admin = getAdminClient()

  const { error } = await admin.from('users').update({ is_active }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}

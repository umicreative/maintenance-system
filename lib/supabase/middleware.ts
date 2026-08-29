import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup')
  const isProtectedRoute =
    path.startsWith('/admin') || path.startsWith('/employee') || path.startsWith('/client')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && (isAuthRoute || isProtectedRoute)) {
    const { data: profile } = await supabase
      .from('users')
      .select('role, approval_status')
      .eq('id', user.id)
      .single()

    // Employees awaiting approval get parked on /pending, no matter what they try to visit
    if (profile?.role === 'employee' && profile.approval_status === 'pending' && path !== '/pending') {
      const url = request.nextUrl.clone()
      url.pathname = '/pending'
      return NextResponse.redirect(url)
    }

    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname =
        profile?.role === 'super_admin'
          ? '/admin'
          : profile?.role === 'client'
            ? '/client'
            : profile?.approval_status === 'pending'
              ? '/pending'
              : '/employee'
      return NextResponse.redirect(url)
    }

    if (path.startsWith('/admin') && profile?.role !== 'super_admin') {
      const url = request.nextUrl.clone()
      url.pathname = profile?.role === 'client' ? '/client' : '/employee'
      return NextResponse.redirect(url)
    }

    if (path.startsWith('/client') && profile?.role !== 'client') {
      const url = request.nextUrl.clone()
      url.pathname = profile?.role === 'super_admin' ? '/admin' : '/employee'
      return NextResponse.redirect(url)
    }

    if (path.startsWith('/employee') && profile?.role !== 'employee') {
      const url = request.nextUrl.clone()
      url.pathname = profile?.role === 'super_admin' ? '/admin' : '/client'
      return NextResponse.redirect(url)
    }
  }

  return response
    }

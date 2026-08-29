# UpKeep — Maintenance Management System

Next.js (App Router) + Tailwind CSS + Supabase, with Role-Based Access
Control for `super_admin` and `employee` users.

## 1. Create the Supabase project

1. Go to https://supabase.com/dashboard → New project.
2. Once it's ready, open **SQL Editor → New query**, paste the entire
   contents of `supabase/schema.sql`, and run it. This creates:
   - `users` table (mirrors `auth.users`, adds `name`/`role`/`is_active`)
   - `tasks` table (work orders)
   - A trigger that auto-creates a `users` row whenever an account signs up
   - RLS policies enforcing the RBAC rules (admins see everything;
     employees see/update only their own assigned tasks)
3. Go to **Authentication → Providers** and make sure **Email** is enabled.
   Turn off "Confirm email" for simplicity in development (Auth → Providers
   → Email → "Confirm email" toggle), since employee accounts are created
   pre-confirmed by an admin anyway.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in, from **Project Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (the **secret** key — used server-side only,
  in `app/api/employees/route.ts`, to create staff accounts. Never expose
  this to the browser or commit it.)

## 3. Install and run

```bash
npm install
npm run dev
```

Visit http://localhost:3000 → redirected to `/login`.

## 4. Create your first Super Admin

The very first account has to be bootstrapped manually, since there's no
admin yet to register one:

1. Temporarily go to **Authentication → Users → Add user** in the
   Supabase dashboard and create yourself an account (or sign up via any
   quick script using `supabase.auth.signUp`). This creates a `users` row
   with `role = 'employee'` by default (via the trigger).
2. In **SQL Editor**, run:
   ```sql
   update public.users set role = 'super_admin' where email = 'you@example.com';
   ```
3. Log in at `/login` with that account — you'll land on `/admin`.

From then on, use the in-app **Employees → Register employee** form to
create every other account (both employees and additional admins).

## How the RBAC works

- `public.users.role` is the source of truth (`super_admin` | `employee`).
- **Middleware** (`middleware.ts` / `lib/supabase/middleware.ts`) checks
  the session on every request: unauthenticated users are sent to
  `/login`, and employees are blocked from `/admin/*` at the routing
  layer.
- **Row Level Security** enforces the same rules at the database layer
  (see `supabase/schema.sql`), so even a direct API call can't let an
  employee read another employee's tasks or edit the staff table.
- New employee accounts are created via `app/api/employees/route.ts`,
  a server-only route using the Supabase **service role** key (the only
  way to create a pre-confirmed auth user without them setting their own
  password by email link).

## Project structure

```
app/
  login/page.tsx            Login screen
  admin/
    layout.tsx               Sidebar + RBAC guard for admin routes
    page.tsx                 Overview (stats)
    employees/page.tsx       Register + list staff
    tasks/page.tsx           Create + list work orders, assign to staff
  employee/
    layout.tsx                Sidebar + guard
    page.tsx                  Assigned tasks, status updates
  api/employees/route.ts     Server route: create/deactivate staff (service role)
components/                  Sidebar, StatCard, PriorityBadge, StatusBadge
lib/supabase/                Browser client, server client, middleware helper
types/index.ts                Shared TS types
supabase/schema.sql           Full DB schema + RLS policies
```

## Extending it

- **Notifications**: add a Postgres trigger on `tasks` insert/update that
  writes to a `notifications` table, or use Supabase Realtime to push
  updates to the employee dashboard live.
- **File attachments**: add a `task_id` column to Supabase Storage
  objects and let employees attach photos of completed work.
- **Audit trail**: log every status change into a `task_status_history`
  table via a trigger, instead of overwriting `tasks.status` directly.

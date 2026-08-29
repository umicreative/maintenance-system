import { Wrench } from 'lucide-react'

export default function AuthShell({
  children,
  eyebrow = 'UpKeep',
}: {
  children: React.ReactNode
  eyebrow?: string
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-mesh-navy" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-violet-500 shadow-glass">
            <Wrench className="h-5 w-5 text-navy-950" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">{eyebrow}</p>
            <h1 className="mt-1 text-xl font-bold text-white">Maintenance Management</h1>
          </div>
        </div>

        <div className="glass-card p-7">{children}</div>
      </div>
    </div>
  )
                                                                                                     }

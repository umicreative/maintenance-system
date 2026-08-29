import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UpKeep — Maintenance Management System',
  description: 'Work order tracking and staff management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

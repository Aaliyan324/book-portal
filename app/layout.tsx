import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hopenx - Learning Management Portal',
  description: 'Enterprise Learning & Lesson Management System with role-based access control, block builder, and Vercel Blob media storage.',
  openGraph: {
    title: 'Hopenx LMS',
    description: 'Modern Lesson Management System built with Next.js App Router, Prisma ORM, and Neon PostgreSQL.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}

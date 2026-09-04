import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Hopenix Learning Portal',
    template: '%s | Hopenix Learning Portal',
  },
  description: 'Production-ready Learning Management System built with Next.js, Prisma ORM, Neon PostgreSQL, and Vercel Blob storage.',
  openGraph: {
    title: 'Hopenix Learning Portal',
    description: 'Empowering seamless learning, course creation, and collaborative editor workflows.',
    siteName: 'Hopenix',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className={`${inter.className} h-full flex flex-col antialiased bg-white text-[#525252]`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}


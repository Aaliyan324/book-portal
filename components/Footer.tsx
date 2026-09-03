import Link from 'next/link'
import { Sparkles, Shield, Lock, Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                H
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Hopenx LMS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enterprise-grade Learning Management Portal with role-based authorization, block builder, and Vercel Blob media storage.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/courses" className="hover:text-blue-600 transition-colors">Course Catalog</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-blue-600 transition-colors">Admin Dashboard</Link></li>
              <li><Link href="/editor/dashboard" className="hover:text-blue-600 transition-colors">Editor Workspace</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Security & Storage
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-blue-500" /> Server-side RBAC</li>
              <li className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-emerald-500" /> Neon PostgreSQL</li>
              <li className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> Vercel Blob Storage</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Quick Accounts
            </h4>
            <div className="space-y-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <p><span className="text-blue-600 font-semibold">Admin:</span> admin@hopenx.com</p>
              <p><span className="text-purple-600 font-semibold">Editor:</span> editor@hopenx.com</p>
              <p><span className="text-emerald-600 font-semibold">Student:</span> student@hopenx.com</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Hopenx LMS. Built with Next.js App Router, Prisma ORM & Neon PostgreSQL.
        </div>
      </div>
    </footer>
  )
}

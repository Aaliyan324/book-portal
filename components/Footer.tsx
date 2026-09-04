import Link from 'next/link'
import { Shield, Lock, Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#D4D4D4] bg-white py-12 text-[#525252]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-[#EA580C] font-bold text-sm">
                H
              </div>
              <span className="text-lg font-bold text-[#171717]">
                Hopenix Learning
              </span>
            </div>
            <p className="text-xs text-[#525252] leading-relaxed">
              Production-grade Learning Management System with granular permissions, interactive lessons, and Vercel Blob media storage.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#525252]">
              <li><Link href="/courses" className="hover:text-[#EA580C] transition-colors">Course Catalog</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-[#EA580C] transition-colors">Admin Portal</Link></li>
              <li><Link href="/editor/dashboard" className="hover:text-[#EA580C] transition-colors">Editor Studio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">
              Infrastructure
            </h4>
            <ul className="space-y-2 text-xs text-[#525252]">
              <li className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-[#EA580C]" /> Role-Based Access Control</li>
              <li className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-[#171717]" /> Neon PostgreSQL</li>
              <li className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-[#EA580C]" /> Vercel Blob Storage</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">
              Portal Accounts
            </h4>
            <div className="space-y-1.5 text-xs text-[#525252]">
              <p><span className="text-[#171717] font-semibold">Admin:</span> admin@hopenix.com</p>
              <p><span className="text-[#EA580C] font-semibold">Editor:</span> editor@hopenix.com</p>
              <p><span className="text-[#525252] font-semibold">Student:</span> student@hopenix.com</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E5E5E5] pt-6 text-center text-xs text-[#525252]">
          © {new Date().getFullYear()} Hopenix Learning Portal. All rights reserved.
        </div>
      </div>
    </footer>
  )
}


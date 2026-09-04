'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, Loader2, Shield, Edit3, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signInAction, demoLoginAction } from '@/actions/auth'
import { Role } from '@prisma/client'

interface LoginFormClientProps {
  error?: string
}

export function LoginFormClient({ error }: LoginFormClientProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Visual Hero Panel (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between p-8 rounded-2xl bg-[#171717] text-white min-h-[540px] relative overflow-hidden border border-[#D4D4D4]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EA580C]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-lg">
              H
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Hopenix</span>
          </div>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight pt-6">
            Empowering Modern Learning & Course Excellence.
          </h2>
          <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-md">
            Join thousands of students, editors, and educators building interactive courses with Next.js 16, Prisma ORM, and Neon PostgreSQL.
          </p>
        </div>

        <div className="space-y-4 relative z-10 pt-8 border-t border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#EA580C] animate-pulse" />
            <span className="text-xs text-[#E5E5E5] font-medium">Production-Ready Learning Management System</span>
          </div>
          <p className="text-xs text-neutral-400">
            Role-Based Access Control • Collaborative Lesson Builder • Vercel Blob Storage
          </p>
        </div>
      </div>

      {/* Authentication Form Panel */}
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2 lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-[#EA580C]">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-2xl font-extrabold text-[#171717]">Hopenix</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717] pt-2">Welcome back</h1>
          <p className="text-sm text-[#525252]">Continue your learning journey with Hopenix.</p>
        </div>

        <div className="gradient-border-shell-card">
          <div className="bg-white p-6 sm:p-8 rounded-[4px] space-y-5">
            {error && (
              <div className="rounded-[2px] bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form action={signInAction} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#171717]">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@hopenix.com"
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#171717]">Password</label>
                  <span className="text-xs text-[#525252] cursor-not-allowed hover:underline">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#171717]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#171717] hover:bg-[#262626] text-white font-medium rounded-full transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D4D4D4]" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-white px-2 text-[#525252] font-semibold">Instant Quick Login</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <form action={async () => { await demoLoginAction(Role.ADMIN) }}>
                <Button type="submit" variant="outline" size="sm" className="w-full text-xs gap-1 border-[#D4D4D4] hover:bg-[#E5E5E5]/50 text-[#171717]">
                  <Shield className="h-3.5 w-3.5 text-[#EA580C]" /> Admin
                </Button>
              </form>
              <form action={async () => { await demoLoginAction(Role.EDITOR) }}>
                <Button type="submit" variant="outline" size="sm" className="w-full text-xs gap-1 border-[#D4D4D4] hover:bg-[#E5E5E5]/50 text-[#171717]">
                  <Edit3 className="h-3.5 w-3.5 text-purple-600" /> Editor
                </Button>
              </form>
              <form action={async () => { await demoLoginAction(Role.STUDENT) }}>
                <Button type="submit" variant="outline" size="sm" className="w-full text-xs gap-1 border-[#D4D4D4] hover:bg-[#E5E5E5]/50 text-[#171717]">
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-600" /> Student
                </Button>
              </form>
            </div>

            <div className="pt-4 text-center border-t border-[#E5E5E5] text-xs text-[#525252]">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-[#EA580C] font-semibold hover:underline ml-1">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

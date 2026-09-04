'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signUpAction } from '@/actions/auth'

interface SignUpFormClientProps {
  error?: string
}

export function SignUpFormClient({ error }: SignUpFormClientProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-[#EA580C]">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold text-[#171717]">Hopenix</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717] pt-2">Create Account</h1>
        <p className="text-sm text-[#525252]">Register your student account to access Hopenix courses.</p>
      </div>

      <div className="gradient-border-shell-card">
        <div className="bg-white p-6 sm:p-8 rounded-[4px] space-y-5">
          {error && (
            <div className="rounded-[2px] bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form action={signUpAction} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171717]">Full Name</label>
              <Input
                type="text"
                name="name"
                required
                placeholder="Alex Johnson"
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171717]">Email Address</label>
              <Input
                type="email"
                name="email"
                required
                placeholder="alex@example.com"
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171717]">Password</label>
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
              <p className="text-[11px] text-[#525252]">Minimum 8 characters</p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#171717] hover:bg-[#262626] text-white font-medium rounded-full transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 text-center border-t border-[#E5E5E5] text-xs text-[#525252]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#EA580C] font-semibold hover:underline ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

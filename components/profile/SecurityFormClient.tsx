'use client'

import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { changePasswordAction } from '@/actions/auth'

export function SecurityFormClient() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const res = await changePasswordAction(formData)
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Password successfully updated!' })
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to update password' })
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="gradient-border-shell-card max-w-2xl">
      <div className="bg-white p-6 sm:p-8 rounded-[4px] space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EA580C]/10 text-[#EA580C]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#171717]">Change Password</h2>
            <p className="text-xs text-[#525252]">Update your password to keep your Hopenix account secure.</p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`rounded-[2px] p-3 text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717]">Current Password</label>
            <div className="relative">
              <Input
                type={showCurrent ? 'text' : 'password'}
                name="currentPassword"
                required
                placeholder="Enter current password"
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#171717]"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717]">New Password</label>
            <div className="relative">
              <Input
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                required
                placeholder="Enter new password"
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#171717]"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#525252]">Minimum 8 characters long</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717]">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                required
                placeholder="Re-enter new password"
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#171717]"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#171717] hover:bg-[#262626] text-white px-6 h-11 rounded-full transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { signInAction, demoLoginAction } from '@/actions/auth'
import { Role } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Shield, Edit3, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const user = await getCurrentUser()
  if (user) {
    if (user.role === Role.ADMIN) redirect('/admin/dashboard')
    if (user.role === Role.EDITOR) redirect('/editor/dashboard')
    redirect('/courses')
  }

  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/30">
              H
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hopenx LMS
            </span>
          </Link>
          <p className="text-sm text-slate-500">Sign in to your learning management account</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email and password to access the portal</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/60 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form action={signInAction} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <Input type="email" name="email" required placeholder="admin@hopenx.com" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Input type="password" name="password" required placeholder="••••••••" />
              </div>

              <Button type="submit" variant="gradient" className="w-full">
                Sign In <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-medium">
                  Instant Demo Access
                </span>
              </div>
            </div>

            {/* Quick Demo Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <form action={async () => { 'use server'; await demoLoginAction(Role.ADMIN) }}>
                <Button type="submit" variant="outline" size="sm" className="w-full text-xs gap-1 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300">
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Button>
              </form>

              <form action={async () => { 'use server'; await demoLoginAction(Role.EDITOR) }}>
                <Button type="submit" variant="outline" size="sm" className="w-full text-xs gap-1 border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300">
                  <Edit3 className="h-3.5 w-3.5" /> Editor
                </Button>
              </form>

              <form action={async () => { 'use server'; await demoLoginAction(Role.STUDENT) }}>
                <Button type="submit" variant="outline" size="sm" className="w-full text-xs gap-1 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300">
                  <GraduationCap className="h-3.5 w-3.5" /> Student
                </Button>
              </form>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 dark:text-blue-400 font-semibold ml-1 hover:underline">
              Create student account
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

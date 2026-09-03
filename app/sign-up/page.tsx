import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { signUpAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { ArrowRight, AlertCircle } from 'lucide-react'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const user = await getCurrentUser()
  if (user) redirect('/courses')

  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/30">
              H
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hopenx LMS
            </span>
          </Link>
          <p className="text-sm text-slate-500">Create your student account to access courses</p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Join Hopenx LMS today</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg bg-rose-50 dark:bg-rose-950/60 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form action={signUpAction} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <Input type="text" name="name" required placeholder="Alex Johnson" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <Input type="email" name="email" required placeholder="alex@example.com" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Input type="password" name="password" required placeholder="••••••••" />
              </div>

              <Button type="submit" variant="gradient" className="w-full">
                Create Student Account <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold ml-1 hover:underline">
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

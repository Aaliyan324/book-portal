import { requireUser } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Role } from '@prisma/client'
import { User as UserIcon, Mail, Shield, Calendar, Edit3, BookOpen } from 'lucide-react'

export default async function ProfilePage() {
  const user = await requireUser()

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      assignedCollaborations: {
        include: { lesson: { select: { title: true, course: { select: { title: true } } } } },
      },
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={user} />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User Account Profile
        </h1>

        <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={fullUser?.avatarUrl || `https://avatar.vercel.sh/${user.name}`}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-500/20"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                <Badge variant={user.role === Role.ADMIN ? 'default' : user.role === Role.EDITOR ? 'purple' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Account created {new Date(fullUser?.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {user.role === Role.EDITOR && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-purple-600" /> Assigned Editor Lessons ({fullUser?.assignedCollaborations.length || 0})
              </h3>
              <div className="space-y-2">
                {fullUser?.assignedCollaborations.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{c.lesson.title}</span>
                    <span className="text-slate-400 font-medium">Course: {c.lesson.course.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  )
}

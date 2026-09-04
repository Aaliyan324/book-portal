'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Menu, X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LessonOutlineItem {
  id: string
  title: string
  slug: string
  estimatedDuration: number
}

interface MobileCourseDrawerProps {
  courseTitle: string
  courseSlug: string
  lessons: LessonOutlineItem[]
  currentLessonId: string
}

export function MobileCourseDrawer({
  courseTitle,
  courseSlug,
  lessons,
  currentLessonId,
}: MobileCourseDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden w-full">
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full justify-between border-[#D4D4D4] bg-white h-11 px-4 text-xs font-semibold text-[#171717] rounded-[2px]"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#EA580C]" /> Course Contents ({lessons.length} lessons)
        </span>
        <Menu className="h-4 w-4 text-[#525252]" />
      </Button>

      {/* Backdrop & Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                    Course Syllabus
                  </span>
                  <h3 className="text-sm font-bold text-[#171717] line-clamp-1">{courseTitle}</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-[#525252] hover:bg-[#E5E5E5] hover:text-[#171717]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1">
                {lessons.map((l, idx) => {
                  const isActive = l.id === currentLessonId
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${courseSlug}/lessons/${l.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-[2px] text-xs transition-colors ${
                        isActive
                          ? 'bg-[#171717] text-white font-semibold'
                          : 'text-[#525252] hover:bg-[#E5E5E5]/60 hover:text-[#171717]'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                          isActive
                            ? 'bg-[#EA580C] text-white font-bold'
                            : 'bg-[#E5E5E5] text-[#525252]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="truncate">{l.title}</p>
                        <p className="text-[10px] opacity-70">{l.estimatedDuration} mins</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] text-center text-xs text-[#525252]">
              Hopenix Learning Portal
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import * as React from 'react'
import { Paperclip, Upload, X, Loader2, Download, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatBytes } from '@/lib/utils'
import { toast } from 'sonner'

interface ResourceUploaderProps {
  onAddResource: (resource: {
    title: string
    url: string
    fileName: string
    mimeType: string
    size: number
  }) => Promise<void>
}

export function ResourceUploader({ onAddResource }: ResourceUploaderProps) {
  const [uploading, setUploading] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'resource')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Resource upload failed')
      }

      const data = await res.json()
      const resourceTitle = title.trim() || file.name

      await onAddResource({
        title: resourceTitle,
        url: data.url,
        fileName: data.fileName,
        mimeType: data.mimeType,
        size: data.size,
      })

      setTitle('')
      toast.success('Downloadable resource added!')
    } catch (err: any) {
      toast.error(err.message || 'Resource upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <Paperclip className="h-4 w-4 text-blue-600" /> Add Downloadable Resource
      </h4>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.xlsx,.zip,.txt,.pptx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Resource title (e.g. Starter Code / PDF Cheatsheet)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white dark:bg-slate-900"
        />
        <Button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Upload className="h-4 w-4 mr-1" />
          )}
          {uploading ? 'Uploading...' : 'Choose File & Attach'}
        </Button>
      </div>
      <p className="text-[11px] text-slate-400">Supported: DOCX, XLSX, ZIP, TXT, PPTX, PDF up to 50MB</p>
    </div>
  )
}

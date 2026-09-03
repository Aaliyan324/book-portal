'use client'

import * as React from 'react'
import { FileText, Upload, X, Loader2, Download, ExternalLink, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatBytes } from '@/lib/utils'
import { toast } from 'sonner'

interface PdfUploaderProps {
  value?: string
  fileName?: string
  size?: number
  onChange: (url: string, metadata?: { fileName: string; size: number }) => void
  disabled?: boolean
}

export function PdfUploader({ value, fileName, size, onChange, disabled }: PdfUploaderProps) {
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('File must be a valid PDF document')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'pdf')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'PDF upload failed')
      }

      const data = await res.json()
      onChange(data.url, { fileName: data.fileName, size: data.size })
      toast.success('PDF uploaded successfully!')
    } catch (err: any) {
      toast.error(err.message || 'PDF upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />

      {value ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
                  {fileName || 'PDF Document'}
                </h4>
                {size && (
                  <p className="text-xs text-slate-500">{formatBytes(size)}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={value} target="_blank" rel="noreferrer">
                <Button type="button" size="sm" variant="outline">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" /> View PDF
                </Button>
              </a>
              <a href={value} download={fileName || 'document.pdf'}>
                <Button type="button" size="sm" variant="secondary">
                  <Download className="h-3.5 w-3.5 mr-1" /> Download
                </Button>
              </a>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onChange('')}
                disabled={disabled || uploading}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Inline PDF Preview Frame */}
          <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
            <iframe src={value} className="w-full h-full" title="PDF Preview" />
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50"
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Uploading PDF document...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Click to upload PDF Document
              </p>
              <p className="text-xs text-slate-400">PDF files up to 25MB with inline preview</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import * as React from 'react'
import { Upload, X, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUploader({ value, onChange, disabled }: ImageUploaderProps) {
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP, GIF)')
      return
    }

    setUploading(true)
    setProgress(30)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'image')

      setProgress(60)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await res.json()
      setProgress(100)
      onChange(data.url)
      toast.success('Image uploaded successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled || uploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="w-full space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />

      {value ? (
        <div className="relative group rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900 max-h-72">
          <img src={value} alt="Uploaded thumbnail" className="w-full h-56 object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onChange('')}
              disabled={disabled || uploading}
            >
              <X className="h-4 w-4 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/20"
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Uploading image... {progress}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Click to upload or drag & drop image
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, WEBP, GIF up to 10MB</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

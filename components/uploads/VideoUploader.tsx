'use client'

import * as React from 'react'
import { Video, Upload, X, Loader2, Link2, RefreshCw, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface VideoUploaderProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function VideoUploader({ value, onChange, disabled }: VideoUploaderProps) {
  const [tab, setTab] = React.useState<'upload' | 'url'>('upload')
  const [externalUrl, setExternalUrl] = React.useState(value || '')
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file (MP4, WEBM, MOV)')
      return
    }

    setUploading(true)
    setProgress(20)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'video')

      setProgress(50)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Video upload failed')
      }

      const data = await res.json()
      setProgress(100)
      onChange(data.url)
      toast.success('Video uploaded successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Video upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleApplyExternalUrl = () => {
    if (!externalUrl.trim()) return
    onChange(externalUrl.trim())
    toast.success('Video URL updated')
  }

  return (
    <div className="w-full space-y-3">
      {/* Toggle between File Upload & External Link */}
      {!value && (
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`pb-2 px-4 border-b-2 transition-colors ${
              tab === 'upload'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Upload Device Video
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`pb-2 px-4 border-b-2 transition-colors ${
              tab === 'url'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            External Video URL (YouTube/Vimeo)
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />

      {value ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-900 p-4 space-y-3">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
            {value.includes('youtube.com') || value.includes('youtu.be') ? (
              <iframe
                src={`https://www.youtube.com/embed/${value.split('v=')[1]?.split('&')[0] || value.split('/').pop()}`}
                className="w-full h-full"
                allowFullScreen
              />
            ) : value.includes('vimeo.com') ? (
              <iframe
                src={`https://player.vimeo.com/video/${value.split('/').pop()}`}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <video src={value} controls className="w-full h-full" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 truncate max-w-xs">{value}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onChange('')}
                disabled={disabled || uploading}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : tab === 'upload' ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files?.[0]
            if (file) handleUpload(file)
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50"
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Uploading video... {progress}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Video className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Click to upload video file
              </p>
              <p className="text-xs text-slate-400">MP4, WEBM, MOV up to 100MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Paste YouTube, Vimeo or MP4 direct link..."
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
          />
          <Button type="button" onClick={handleApplyExternalUrl}>
            Save Link
          </Button>
        </div>
      )}
    </div>
  )
}

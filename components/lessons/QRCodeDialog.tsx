'use client'

import * as React from 'react'
import QRCode from 'qrcode'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { QrCode, Copy, Download, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  title: string
}

export function QRCodeDialog({
  open,
  onOpenChange,
  url,
  title,
}: QRCodeDialogProps) {
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('')
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (open && url) {
      QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e3a8a', // Deep Hopenx blue QR modules
          light: '#ffffff',
        },
      })
        .then((dataUrl) => setQrDataUrl(dataUrl))
        .catch((err) => console.error('QR code generation error:', err))
    }
  }, [open, url])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('URL copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy URL')
    }
  }

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-qrcode.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR Code downloaded successfully!')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Share & Scan QR Code"
      description={`Dynamic QR code for "${title}"`}
    >
      <div className="flex flex-col items-center justify-center space-y-5 py-2">
        {/* QR Code Container */}
        <div className="relative p-4 rounded-2xl bg-white border border-slate-200 shadow-lg">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`QR Code for ${title}`} className="h-56 w-56 object-contain" />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center text-slate-400">
              <QrCode className="h-12 w-12 animate-pulse" />
            </div>
          )}
        </div>

        {/* Public URL Box */}
        <div className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300">
          <span className="truncate pr-2">{url}</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button variant="outline" onClick={handleCopy} className="w-full flex items-center gap-2">
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy URL'}
          </Button>

          <Button variant="gradient" onClick={handleDownload} className="w-full flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

'use client'

import * as React from 'react'
import QRCode from 'qrcode'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
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
          dark: '#171717', // Hopenix dark contrast module
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-white border border-[#D4D4D4] rounded-[4px] space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#171717] flex items-center gap-2">
            <QrCode className="h-5 w-5 text-[#EA580C]" /> Share & Scan QR Code
          </DialogTitle>
          <DialogDescription className="text-xs text-[#525252]">
            Dynamic QR code for <span className="font-semibold text-[#171717]">&quot;{title}&quot;</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4 py-2">
          {/* QR Code Container */}
          <div className="p-3 rounded-[4px] bg-white border border-[#D4D4D4] shadow-sm">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`QR Code for ${title}`} className="h-52 w-52 object-contain" />
            ) : (
              <div className="flex h-52 w-52 items-center justify-center text-[#525252]">
                <QrCode className="h-10 w-10 animate-pulse" />
              </div>
            )}
          </div>

          {/* Public URL Box */}
          <div className="w-full rounded-[2px] bg-[#E5E5E5]/30 p-2.5 border border-[#D4D4D4] flex items-center justify-between text-xs font-mono text-[#525252]">
            <span className="truncate pr-2">{url}</span>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-[#EA580C] hover:underline flex items-center gap-1 shrink-0 font-sans font-semibold"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open
            </a>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 w-full pt-2">
            <Button variant="outline" onClick={handleCopy} className="w-full text-xs rounded-full border-[#D4D4D4]">
              {copied ? <Check className="h-4 w-4 text-emerald-600 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy URL'}
            </Button>

            <Button onClick={handleDownload} className="w-full bg-[#171717] hover:bg-[#262626] text-white text-xs rounded-full">
              <Download className="h-4 w-4 mr-1" />
              Download PNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


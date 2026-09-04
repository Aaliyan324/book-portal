'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { QrCode } from 'lucide-react'
import { QRCodeDialog } from '@/components/lessons/QRCodeDialog'

interface QRCodeButtonClientProps {
  url: string
  title: string
}

export function QRCodeButtonClient({ url, title }: QRCodeButtonClientProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2 shrink-0 border-[#D4D4D4] text-[#171717] hover:bg-[#E5E5E5]/50 text-xs rounded-full"
      >
        <QrCode className="h-4 w-4 text-[#EA580C]" /> Share QR Code
      </Button>

      <QRCodeDialog
        open={open}
        onOpenChange={setOpen}
        url={url}
        title={title}
      />
    </>
  )
}


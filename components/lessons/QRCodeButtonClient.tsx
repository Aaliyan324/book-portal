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
        className="gap-2 shrink-0 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
      >
        <QrCode className="h-4 w-4" /> Share QR Code
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

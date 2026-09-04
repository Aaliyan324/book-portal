import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#EA580C]',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#EA580C]/10 text-[#EA580C] border-[#EA580C]/20',
        primary: 'border-transparent bg-[#171717] text-white',
        secondary: 'border-transparent bg-[#E5E5E5] text-[#171717]',
        success: 'border-transparent bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'border-transparent bg-amber-50 text-amber-700 border-amber-200',
        destructive: 'border-transparent bg-rose-50 text-rose-700 border-rose-200',
        outline: 'text-[#525252] border-[#D4D4D4]',
        purple: 'border-transparent bg-purple-50 text-purple-700 border-purple-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }


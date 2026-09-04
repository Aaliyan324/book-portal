import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[#171717] text-white hover:bg-[#262626] rounded-full shadow-sm border border-transparent',
        accent: 'bg-[#EA580C] text-white hover:bg-[#c2410c] rounded-full shadow-sm border border-transparent',
        destructive: 'bg-red-600 text-white hover:bg-red-700 rounded-full shadow-sm',
        outline: 'border border-[#D4D4D4] bg-white text-[#171717] hover:bg-[#E5E5E5]/50 rounded-full',
        secondary: 'bg-[#E5E5E5] text-[#171717] hover:bg-[#d4d4d4] rounded-full',
        ghost: 'hover:bg-[#E5E5E5]/60 text-[#525252] rounded-md',
        link: 'text-[#525252] hover:text-[#171717] underline-offset-4 hover:underline p-0 h-auto rounded-none',
        gradient: 'bg-gradient-to-r from-[#171717] to-[#EA580C] text-white hover:opacity-95 rounded-full shadow-sm',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-7 text-base font-medium',
        icon: 'h-9 w-9 p-0 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }


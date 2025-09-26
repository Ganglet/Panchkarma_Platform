import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg',
        destructive:
          'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg',
        outline:
          'border-2 border-primary/20 bg-background/80 backdrop-blur-sm text-primary shadow-sm hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:bg-primary active:text-white active:translate-y-0',
        secondary:
          'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg',
        ghost:
          'text-primary hover:bg-primary/5 hover:text-primary hover:shadow-md hover:-translate-y-0.5 active:bg-primary/10 active:text-primary active:translate-y-0',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
        gradient:
          'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg',
        premium:
          'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg border border-white/20',
        subtle:
          'border border-border/50 bg-background/50 backdrop-blur-sm text-foreground shadow-sm hover:bg-primary/5 hover:text-primary hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:bg-primary/10 active:text-primary active:translate-y-0',
      },
      size: {
        default: 'h-10 px-6 py-2 has-[>svg]:px-4',
        sm: 'h-8 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 has-[>svg]:px-6 text-base',
        xl: 'h-14 rounded-2xl px-10 has-[>svg]:px-8 text-lg',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : motion.button

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Shimmer effect overlay */}
      <span className="absolute inset-0 -top-px left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.5s_ease-in-out] transition-opacity duration-300" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </Comp>
  )
}

export { Button, buttonVariants }

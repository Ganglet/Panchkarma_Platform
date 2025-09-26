import * as React from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <motion.input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-11 w-full min-w-0 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm px-4 py-3 text-base shadow-sm transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-lg focus-visible:shadow-primary/10',
        'hover:border-primary/50 hover:shadow-md',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        className,
      )}
      whileFocus={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    />
  )
}

export { Input }

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <motion.textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm px-4 py-3 text-sm shadow-sm transition-all duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-lg focus-visible:shadow-primary/10 hover:border-primary/50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className,
      )}
      ref={ref}
      whileFocus={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

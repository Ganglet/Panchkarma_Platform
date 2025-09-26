import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <motion.div
      data-slot="skeleton"
      className={cn(
        'bg-gradient-to-r from-muted via-muted/50 to-muted rounded-xl relative overflow-hidden',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          translateX: ['100%', '200%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </motion.div>
  )
}

// Enhanced skeleton variants
function SkeletonCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('space-y-4 p-6', className)} {...props}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[75%]" />
      </div>
    </div>
  )
}

function SkeletonDashboard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

function SkeletonTable({ rows = 5, className, ...props }: React.ComponentProps<'div'> & { rows?: number }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Table header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4">
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

function SkeletonList({ items = 4, className, ...props }: React.ComponentProps<'div'> & { items?: number }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-xl">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-3 w-[40%]" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonDashboard, 
  SkeletonTable, 
  SkeletonList 
}

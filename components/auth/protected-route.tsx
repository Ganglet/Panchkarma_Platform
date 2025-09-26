"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedUserTypes?: ('patient' | 'practitioner' | 'admin')[]
}

export function ProtectedRoute({ children, allowedUserTypes }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/')
        return
      }

      if (allowedUserTypes && profile && !allowedUserTypes.includes(profile.user_type)) {
        router.push('/')
        return
      }
    }
  }, [user, profile, loading, allowedUserTypes, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedUserTypes && profile && !allowedUserTypes.includes(profile.user_type)) {
    return null
  }

  return <>{children}</>
}


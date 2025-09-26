"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { SetupNotice } from "@/components/setup-notice"
import { isSupabaseReady } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function HomePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.user_type === 'practitioner') {
        router.push('/practitioner/dashboard')
      } else if (profile.user_type === 'patient') {
        router.push('/patient/dashboard')
      } else if (profile.user_type === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/patient/dashboard')
      }
    }
  }, [user, profile, loading, router])

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

  if (user && profile) {
    return null // Will redirect
  }

  // Show setup notice if Supabase is not configured
  if (!isSupabaseReady) {
    return <SetupNotice />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-4"
          >
            <div className="w-16 h-16 mx-auto mb-4">
              <img 
                src="/panchakarma-logo.png" 
                alt="Panchakarma Platform Logo" 
                className="w-full h-full"
              />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Panchakarma Platform
          </h1>
          <p className="text-muted-foreground text-lg">Traditional Ayurveda meets modern efficiency</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome</CardTitle>
              <CardDescription>Sign in to access your therapy management dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-6 text-sm text-muted-foreground"
        >
          <p>Empowering healthcare with digital innovation</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

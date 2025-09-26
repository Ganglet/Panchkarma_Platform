"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { isSupabaseReady } from "@/lib/supabase"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    clinicId: ""
  })
  const router = useRouter()
  const { signIn, signUp, profile, user, resetPassword } = useAuth()

  const handleLogin = async (e: React.FormEvent, userType: "patient" | "practitioner" | "admin") => {
    e.preventDefault()
    console.log('🔐 LOGIN FORM: Form submitted, preventing default')
    setIsLoading(true)
    console.log('🔐 LOGIN FORM: Set loading to true')

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    console.log('🔐 LOGIN FORM: Form data extracted:', { email, password: password ? '***' : 'empty' })

    try {
      console.log('🔐 LOGIN FORM: Starting login process')
      console.log('🔐 LOGIN FORM: Email:', email)
      console.log('🔐 LOGIN FORM: Password length:', password.length)
      console.log('🔐 LOGIN FORM: Expected user type:', userType)
      console.log('🔐 LOGIN FORM: Current profile:', profile)
      console.log('🔐 LOGIN FORM: Current user:', user)
      
      const { error } = await signIn(email, password)
      console.log('🔐 LOGIN FORM: Sign in result:', { error })
      
      if (error) {
        console.log('❌ LOGIN FORM: Login error:', error)
        // Handle specific error messages
        if (error.message && error.message.includes('captcha')) {
          toast.error("Authentication failed. Please check your credentials.")
        } else if (error.message && error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password. Please try again.")
        } else {
          toast.error(error.message || "Login failed. Please try again.")
        }
      } else {
        console.log('✅ LOGIN FORM: Login successful, redirecting...')
        toast.success("Login successful! Redirecting...")
        // Give a moment for the profile to be fetched
        setTimeout(() => {
          // Check both profile and user for user type
          const detectedUserType = profile?.user_type || user?.user_metadata?.user_type
          console.log('🔐 LOGIN FORM: Redirecting based on user type:', detectedUserType)
          
          if (detectedUserType === 'practitioner') {
            console.log('🔐 LOGIN FORM: Redirecting to practitioner dashboard')
            router.push('/practitioner/dashboard')
          } else if (detectedUserType === 'patient') {
            console.log('🔐 LOGIN FORM: Redirecting to patient dashboard')
            router.push('/patient/dashboard')
          } else if (detectedUserType === 'admin') {
            console.log('🔐 LOGIN FORM: Redirecting to admin dashboard')
            router.push('/admin/dashboard')
          } else {
            console.log('⚠️ LOGIN FORM: Unknown user type, redirecting to patient dashboard')
            router.push('/patient/dashboard')
          }
        }, 1000)
      }
    } catch (error) {
      console.error('❌ LOGIN FORM: Unexpected error:', error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent, userType: "patient" | "practitioner") => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const clinicId = userType === "practitioner" ? formData.get("clinicId") as string : undefined

    try {
      const { error } = await signUp(email, password, userType, firstName, lastName, clinicId)
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Registration successful! Please check your email to verify your account.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="patient" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="practitioner">Practitioner</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="patient">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Patient Access</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? "Sign In" : "Register"}
                </Button>
              </div>
              
              {isRegistering ? (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(e) => handleRegister(e, "patient")}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-firstName">First Name</Label>
                      <Input id="patient-firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-lastName">Last Name</Label>
                      <Input id="patient-lastName" name="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email-register">Email</Label>
                    <Input id="patient-email-register" name="email" type="email" placeholder="patient@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password-register">Password</Label>
                    <Input id="patient-password-register" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Register as Patient"}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(e) => handleLogin(e, "patient")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input id="patient-email" name="email" type="email" placeholder="patient@demo.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input id="patient-password" name="password" type="password" placeholder="demo123" required />
                  </div>
                  {!isSupabaseReady && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <strong>Demo Mode:</strong> Use patient@demo.com / demo123
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Patient"}
                  </Button>
                  <div className="text-center mt-2">
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-primary underline"
                      onClick={async () => {
                        const email = (document.getElementById('patient-email') as HTMLInputElement)?.value
                        if (email && email.includes('@')) {
                          const { error } = await resetPassword(email)
                          if (error) {
                            toast.error(error.message)
                          } else {
                            toast.success("Password reset email sent! Check your inbox.")
                          }
                        } else {
                          toast.error("Please enter a valid email address first")
                        }
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </motion.form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practitioner">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Practitioner Access</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? "Sign In" : "Register"}
                </Button>
              </div>
              
              {isRegistering ? (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(e) => handleRegister(e, "practitioner")}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-firstName">First Name</Label>
                      <Input id="practitioner-firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-lastName">Last Name</Label>
                      <Input id="practitioner-lastName" name="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practitioner-email-register">Email</Label>
                    <Input id="practitioner-email-register" name="email" type="email" placeholder="doctor@clinic.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practitioner-password-register">Password</Label>
                    <Input id="practitioner-password-register" name="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic-id-register">Clinic</Label>
                    <Select name="clinicId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ayur-wellness">Ayur Wellness Center</SelectItem>
                        <SelectItem value="traditional-healing">Traditional Healing Clinic</SelectItem>
                        <SelectItem value="panchakarma-center">Panchakarma Specialty Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Register as Practitioner"}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(e) => handleLogin(e, "practitioner")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="practitioner-email">Email</Label>
                    <Input id="practitioner-email" name="email" type="email" placeholder="practitioner@demo.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practitioner-password">Password</Label>
                    <Input id="practitioner-password" name="password" type="password" placeholder="demo123" required />
                  </div>
                  {!isSupabaseReady && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <strong>Demo Mode:</strong> Use practitioner@demo.com / demo123
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Practitioner"}
                  </Button>
                  <div className="text-center mt-2">
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-primary underline"
                      onClick={async () => {
                        const email = (document.getElementById('practitioner-email') as HTMLInputElement)?.value
                        if (email && email.includes('@')) {
                          const { error } = await resetPassword(email)
                          if (error) {
                            toast.error(error.message)
                          } else {
                            toast.success("Password reset email sent! Check your inbox.")
                          }
                        } else {
                          toast.error("Please enter a valid email address first")
                        }
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </motion.form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Admin Access</h3>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Login Only
                </div>
              </div>
              
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={(e) => handleLogin(e, "admin")}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" name="email" type="email" placeholder="admin@demo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" name="password" type="password" placeholder="demo123" required />
                </div>
                {!isSupabaseReady && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    <strong>Demo Mode:</strong> Use admin@demo.com / demo123
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in as Admin"}
                </Button>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-primary underline"
                    onClick={async () => {
                      const email = (document.getElementById('admin-email') as HTMLInputElement)?.value
                      if (email && email.includes('@')) {
                        const { error } = await resetPassword(email)
                        if (error) {
                          toast.error(error.message)
                        } else {
                          toast.success("Password reset email sent! Check your inbox.")
                        }
                      } else {
                        toast.error("Please enter a valid email address first")
                      }
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              </motion.form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

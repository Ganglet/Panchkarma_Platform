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
  const { signIn, signUp, profile } = useAuth()

  const handleLogin = async (e: React.FormEvent, userType: "patient" | "practitioner") => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Login successful! Redirecting...")
        // Give a moment for the profile to be fetched
        setTimeout(() => {
          if (profile?.user_type === 'practitioner') {
            router.push('/practitioner/dashboard')
          } else if (profile?.user_type === 'patient') {
            router.push('/patient/dashboard')
          }
        }, 1000)
      }
    } catch (error) {
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="practitioner">Practitioner</TabsTrigger>
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
                    <Input id="patient-email" name="email" type="email" placeholder="patient@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input id="patient-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Patient"}
                  </Button>
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
                    <Input id="practitioner-email" name="email" type="email" placeholder="doctor@clinic.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practitioner-password">Password</Label>
                    <Input id="practitioner-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Practitioner"}
                  </Button>
                </motion.form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

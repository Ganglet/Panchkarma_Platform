"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, UserPlus, Building2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ClinicService } from "@/lib/practitioner-service"
import { useToast } from "@/hooks/use-toast"

export default function PractitionerRegistration() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clinicId, setClinicId] = useState("")
  const [clinicName, setClinicName] = useState("")
  const [showClinicForm, setShowClinicForm] = useState(false)
  const [clinicLoading, setClinicLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    experienceYears: "",
    bio: "",
    clinicId: "",
  })

  const specializations = [
    "Panchakarma Specialist",
    "Abhyanga Therapist",
    "Shirodhara Specialist",
    "Basti Specialist",
    "Nasya Specialist",
    "Virechana Specialist",
    "General Ayurvedic Practitioner",
    "Ayurvedic Consultant",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (!formData.clinicId && !clinicId) {
        throw new Error("Please select or create a clinic")
      }

      const finalClinicId = formData.clinicId || clinicId

      const { error } = await signUp(
        formData.email,
        formData.password,
        "practitioner",
        formData.firstName,
        formData.lastName,
        finalClinicId
      )

      if (error) {
        throw error
      }

      toast({
        title: "Registration Successful",
        description: "Your practitioner account has been created. Please check your email to verify your account.",
      })

      router.push("/practitioner/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault()
    setClinicLoading(true)

    try {
      const clinicData = {
        name: clinicName,
        address: "To be updated",
        phone: "",
        email: "",
        website: "",
        description: "New clinic created during practitioner registration",
        services: [],
        operating_hours: {},
      }

      const clinic = await ClinicService.createClinic(clinicData)
      setClinicId(clinic.id)
      setFormData({ ...formData, clinicId: clinic.id })
      setShowClinicForm(false)
      
      toast({
        title: "Clinic Created",
        description: "Your clinic has been created successfully.",
      })
    } catch (error: any) {
      console.error("Clinic creation error:", error)
      toast({
        title: "Clinic Creation Failed",
        description: error.message || "An error occurred while creating the clinic. Please try again.",
        variant: "destructive",
      })
    } finally {
      setClinicLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-emerald-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text-secondary mb-2">
            Practitioner Registration
          </h1>
          <p className="text-muted-foreground">
            Join our network of certified Panchakarma practitioners
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Create your practitioner account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value) => setFormData({ ...formData, specialization: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">Years of Experience</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min="0"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your experience and approach to Panchakarma..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Register as Practitioner
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Clinic Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Clinic Information
              </CardTitle>
              <CardDescription>
                Select your clinic or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showClinicForm ? (
                <>
                  <div className="space-y-2">
                    <Label>Select Existing Clinic</Label>
                    <Select
                      value={formData.clinicId}
                      onValueChange={(value) => setFormData({ ...formData, clinicId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ayur-wellness">Ayur Wellness Center</SelectItem>
                        <SelectItem value="traditional-healing">Traditional Healing Clinic</SelectItem>
                        <SelectItem value="panchakarma-center">Panchakarma Specialty Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">Don't see your clinic?</p>
                    <Button
                      variant="outline"
                      onClick={() => setShowClinicForm(true)}
                      className="w-full"
                    >
                      Create New Clinic
                    </Button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleCreateClinic} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Clinic Name</Label>
                    <Input
                      id="clinicName"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="Enter your clinic name"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowClinicForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={clinicLoading} className="flex-1">
                      {clinicLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Create Clinic
                    </Button>
                  </div>
                </form>
              )}

              {clinicId && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Clinic selected: {clinicName || "Selected clinic"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

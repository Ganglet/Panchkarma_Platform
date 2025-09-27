"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Eye, Edit, Calendar, Loader2 } from "lucide-react"
import { PractitionerService } from "@/lib/practitioner-service"
import { AppointmentService } from "@/lib/appointment-service"
import { useAuth } from "@/contexts/auth-context"
import { isSupabaseReady, supabase } from "@/lib/supabase"

interface Patient {
  id: string
  name: string
  age?: number
  condition?: string
  status: "active" | "completed" | "paused"
  nextSession: string
  progress: number
  avatar?: string
  email?: string
  first_name?: string
  last_name?: string
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 34,
    condition: "Stress & Anxiety",
    status: "active",
    nextSession: "2024-01-15",
    progress: 65,
    avatar: "/serene-indian-woman.png",
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    age: 45,
    condition: "Digestive Issues",
    status: "active",
    nextSession: "2024-01-16",
    progress: 40,
    avatar: "/indian-man.png",
  },
  {
    id: "3",
    name: "Anita Patel",
    age: 28,
    condition: "Skin Disorders",
    status: "completed",
    nextSession: "Completed",
    progress: 100,
    avatar: "/serene-indian-woman.png",
  },
]

interface PatientManagementProps {
  onRefresh?: () => void
}

export function PatientManagement({ onRefresh }: PatientManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  useEffect(() => {
    if (profile) {
      loadPatients()
    }
  }, [profile])

  const loadPatients = async () => {
    if (!profile) return
    
    setLoading(true)
    try {
      if (isSupabaseReady) {
        console.log('Loading real patients for practitioner:', profile.id)
        
        // Test: First, let's see if we can fetch any profiles at all
        console.log('Testing profile fetch...')
        const { data: testProfiles, error: testError } = await supabase
          .from('profiles')
          .select('*')
          .limit(3)
        console.log('Test profiles fetch result:', { testProfiles, testError })
        
        // Get patients from confirmed appointments
        const allAppointments = await AppointmentService.getAppointments(profile.id, 'practitioner')
        console.log('All appointments for practitioner:', allAppointments)
        const confirmedAppointments = allAppointments.filter(apt => apt.status === 'confirmed')
        console.log('Confirmed appointments:', confirmedAppointments)
        
        // Get unique patients from confirmed appointments with their profile data
        const uniquePatientIds = [...new Set(confirmedAppointments.map(apt => apt.patient_id))]
        console.log('Unique patient IDs:', uniquePatientIds)
        
        const patientsData = await Promise.all(
          uniquePatientIds.map(async (patientId) => {
            const patientAppointments = confirmedAppointments.filter(apt => apt.patient_id === patientId)
            const nextAppointment = patientAppointments
              .filter(apt => new Date(apt.appointment_date) > new Date())
              .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())[0]
            
            // Always manually fetch patient profile to ensure we get the data
            console.log('Fetching patient profile for ID:', patientId)
            let patientProfile = null
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', patientId)
                .single()
              
              if (profileError) {
                console.error('Error fetching patient profile:', profileError)
              } else {
                patientProfile = profileData
                console.log('Successfully fetched patient profile:', patientProfile)
              }
            } catch (error) {
              console.error('Error in profile fetch:', error)
            }
            
            // Calculate real progress based on completed vs total appointments
            const totalAppointments = patientAppointments.length
            const completedAppointments = patientAppointments.filter(apt => apt.status === 'completed').length
            const progress = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0
            
            // Create patient name with better fallback logic
            let patientName = `Patient ${patientId.slice(0, 8)}` // Default fallback
            
            if (patientProfile) {
              if (patientProfile.first_name || patientProfile.last_name) {
                patientName = `${patientProfile.first_name || ''} ${patientProfile.last_name || ''}`.trim()
              } else if (patientProfile.email) {
                patientName = patientProfile.email.split('@')[0] // Use email username part
              }
            }
            
            console.log('Final patient name:', patientName, 'from profile:', patientProfile)
            
            const patient: Patient = {
              id: patientId,
              name: patientName,
              status: 'active',
              nextSession: nextAppointment ? new Date(nextAppointment.appointment_date).toLocaleDateString() : 'No upcoming',
              progress: progress,
              condition: patientAppointments[0]?.therapy || 'General Therapy',
              email: patientProfile?.email,
              first_name: patientProfile?.first_name,
              last_name: patientProfile?.last_name
            }
            return patient
          })
        )
        
        setPatients(patientsData)
        console.log('Loaded patients:', patientsData)
      } else {
        // Use mock data
        setPatients(mockPatients)
      }
    } catch (error) {
      console.error('Error loading patients:', error)
      setPatients(mockPatients) // Fallback to mock data
    } finally {
      setLoading(false)
      // Call the refresh callback if provided
      if (onRefresh) {
        onRefresh()
      }
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.condition && patient.condition.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === "all" || patient.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "paused":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <span className="ml-2 text-gray-600">Loading patients...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
          <p className="text-gray-600">Manage your patients and their therapy programs</p>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} from confirmed appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadPatients}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Refresh
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Patient
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                    <AvatarFallback>
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">
                      Age: {patient.age} • {patient.condition}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500">Next: {patient.nextSession}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${patient.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{patient.progress}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

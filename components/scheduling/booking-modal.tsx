"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { PractitionerService, PractitionerProfile } from "@/lib/practitioner-service"
import { TherapyService, Therapy } from "@/lib/therapy-service"
import { AppointmentService } from "@/lib/appointment-service"
import { MockDataService, mockPractitioners } from "@/lib/mock-data-service"
import { isSupabaseReady } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  userType: "patient" | "practitioner"
}

export function BookingModal({ isOpen, onClose, userType }: BookingModalProps) {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [practitioners, setPractitioners] = useState<PractitionerProfile[]>([])
  const [therapies, setTherapies] = useState<Therapy[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    therapy: "",
    therapyId: "",
    date: "",
    time: "",
    practitioner: "",
    practitionerId: "",
    patient: "",
    patientId: "",
    notes: "",
  })

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
  ]

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    setLoadingData(true)
    try {
      let practitionersData, therapiesData
      
      if (isSupabaseReady) {
        // Use real Supabase data
        [practitionersData, therapiesData] = await Promise.all([
          PractitionerService.getAllPractitioners(),
          TherapyService.getAllTherapies()
        ])
      } else {
        // Use mock data
        practitionersData = mockPractitioners
        therapiesData = [
          { id: '1', name: 'Abhyanga', description: 'Full body oil massage', duration_minutes: 60 },
          { id: '2', name: 'Shirodhara', description: 'Oil pouring on forehead', duration_minutes: 45 },
          { id: '3', name: 'Basti', description: 'Medicated enema therapy', duration_minutes: 90 },
          { id: '4', name: 'Nasya', description: 'Nasal administration of medicines', duration_minutes: 30 },
          { id: '5', name: 'Virechana', description: 'Therapeutic purgation', duration_minutes: 120 }
        ]
      }
      
      setPractitioners(practitionersData)
      setTherapies(therapiesData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  // Check available time slots when date and practitioner are selected
  useEffect(() => {
    if (formData.date && formData.practitionerId) {
      checkAvailableSlots()
    }
  }, [formData.date, formData.practitionerId])

  const checkAvailableSlots = async () => {
    try {
      if (isSupabaseReady) {
        const startDate = new Date(formData.date)
        const endDate = new Date(formData.date)
        endDate.setDate(endDate.getDate() + 1)

        const schedule = await PractitionerService.getPractitionerSchedule(
          formData.practitionerId,
          startDate.toISOString(),
          endDate.toISOString()
        )

        const bookedSlots = schedule.map(apt => {
          const date = new Date(apt.appointment_date)
          return date.toTimeString().slice(0, 5)
        })

        const available = timeSlots.filter(slot => !bookedSlots.includes(slot))
        setAvailableSlots(available)
      } else {
        // Mock data - simulate some booked slots
        const mockBookedSlots = ['09:00', '14:00', '15:30']
        const available = timeSlots.filter(slot => !mockBookedSlots.includes(slot))
        setAvailableSlots(available)
      }
    } catch (error) {
      console.error('Error checking available slots:', error)
      setAvailableSlots(timeSlots) // Fallback to all slots
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!profile) {
        throw new Error('User not authenticated')
      }

      const appointmentDateTime = new Date(`${formData.date}T${formData.time}:00`)
      
      const appointmentData = {
        patientId: userType === 'patient' ? profile.id : formData.patientId,
        practitionerId: userType === 'practitioner' ? profile.id : formData.practitionerId,
        therapy: formData.therapy,
        appointmentDate: appointmentDateTime.toISOString(),
        duration: 60, // Default duration, could be made dynamic based on therapy
        notes: formData.notes,
      }

      if (isSupabaseReady) {
        await AppointmentService.createAppointment(appointmentData)
      } else {
        // Simulate appointment creation with mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      })

      onClose()
      // Reset form
      setFormData({
        therapy: "",
        therapyId: "",
        date: "",
        time: "",
        practitioner: "",
        practitionerId: "",
        patient: "",
        patientId: "",
        notes: "",
      })
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {userType === "patient" ? "Book New Appointment" : "Schedule Appointment"}
          </DialogTitle>
          <DialogDescription>
            {userType === "patient" ? "Schedule your next therapy session" : "Add a new appointment to the schedule"}
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="therapy">Therapy Type</Label>
                <Select 
                  value={formData.therapyId} 
                  onValueChange={(value) => {
                    const therapy = therapies.find(t => t.id === value)
                    setFormData({ 
                      ...formData, 
                      therapyId: value,
                      therapy: therapy?.name || ""
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select therapy" />
                  </SelectTrigger>
                  <SelectContent>
                    {therapies.map((therapy) => (
                      <SelectItem key={therapy.id} value={therapy.id}>
                        {therapy.name} ({therapy.duration_minutes} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select 
                  value={formData.time} 
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                  disabled={!formData.date || !formData.practitionerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {(availableSlots.length > 0 ? availableSlots : timeSlots).map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="practitioner">{userType === "patient" ? "Practitioner" : "Patient"}</Label>
                {userType === "patient" ? (
                  <Select
                    value={formData.practitionerId}
                    onValueChange={(value) => {
                      const practitioner = practitioners.find(p => p.id === value)
                      setFormData({ 
                        ...formData, 
                        practitionerId: value,
                        practitioner: practitioner ? `${practitioner.first_name} ${practitioner.last_name}` : ""
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select practitioner" />
                    </SelectTrigger>
                    <SelectContent>
                      {practitioners.map((practitioner) => (
                        <SelectItem key={practitioner.id} value={practitioner.id}>
                          Dr. {practitioner.first_name} {practitioner.last_name}
                          {practitioner.specialization && ` - ${practitioner.specialization}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Patient name"
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    required
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {userType === "patient" ? "Book Appointment" : "Schedule Appointment"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

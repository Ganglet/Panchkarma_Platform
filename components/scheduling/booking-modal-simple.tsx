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
import { AppointmentServiceClient as AppointmentService } from "@/lib/appointment-service-client"
import { PractitionerService } from "@/lib/practitioner-service"
import { TherapyService } from "@/lib/therapy-service"
import { NotificationServiceClient } from "@/lib/notification-service-client"
import { isSupabaseReady } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  userType: "patient" | "practitioner"
  onAppointmentBooked?: () => void
  selectedDate?: Date
}

export function BookingModalSimple({ isOpen, onClose, userType, onAppointmentBooked, selectedDate }: BookingModalProps) {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [practitioners, setPractitioners] = useState<any[]>([])
  const [therapies, setTherapies] = useState<any[]>([])

  // Fallback data if Supabase fails
  const fallbackPractitioners = [
    {
      id: 'practitioner-1',
      first_name: 'Dr. Rajesh',
      last_name: 'Sharma',
      specialization: 'Panchakarma Therapy',
      experience_years: 12
    },
    {
      id: 'practitioner-2',
      first_name: 'Dr. Priya',
      last_name: 'Patel',
      specialization: 'Abhyanga & Shirodhara',
      experience_years: 8
    },
    {
      id: 'practitioner-3',
      first_name: 'Dr. Amit',
      last_name: 'Kumar',
      specialization: 'Basti & Virechana',
      experience_years: 15
    },
    {
      id: 'practitioner-4',
      first_name: 'Dr. Meera',
      last_name: 'Singh',
      specialization: 'Nasya & Respiratory Therapy',
      experience_years: 10
    }
  ]

  const fallbackTherapies = [
    { id: '1', name: 'Abhyanga', duration_minutes: 60, category: 'Massage' },
    { id: '2', name: 'Shirodhara', duration_minutes: 45, category: 'Relaxation' },
    { id: '3', name: 'Basti', duration_minutes: 90, category: 'Detoxification' },
    { id: '4', name: 'Nasya', duration_minutes: 30, category: 'Respiratory' },
    { id: '5', name: 'Virechana', duration_minutes: 120, category: 'Detoxification' }
  ]

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
  ]

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

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, selectedDate])

  const loadData = async () => {
    setLoadingData(true)
    try {
      
      if (isSupabaseReady) {
        try {
          const practitionersData = await PractitionerService.getAllPractitioners()
          const therapiesData = await TherapyService.getAllTherapies()
          setPractitioners(practitionersData || [])
          setTherapies(therapiesData || [])
        } catch (error) {
          console.error('Error loading Supabase data:', error)
          console.error('Error details:', error instanceof Error ? error.message : String(error))
          console.error('Full error object:', error)
          
          // Try a direct query to see if it's a service issue
          try {
            const { supabase } = await import('@/lib/supabase')
            const { data: directData, error: directError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_type', 'practitioner')
            
            if (directData && directData.length > 0) {
              setPractitioners(directData)
              setTherapies(fallbackTherapies) // Use fallback for therapies for now
            } else {
              setPractitioners(fallbackPractitioners)
              setTherapies(fallbackTherapies)
            }
          } catch (directError) {
            console.error('Direct query also failed:', directError)
            setPractitioners(fallbackPractitioners)
            setTherapies(fallbackTherapies)
          }
        }
      } else {
        setPractitioners(fallbackPractitioners)
        setTherapies(fallbackTherapies)
      }
      
      // Set selected date or today's date as default
      let defaultDate
      if (selectedDate) {
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        defaultDate = `${year}-${month}-${day}`
      } else {
        defaultDate = new Date().toISOString().split('T')[0]
      }
      setFormData(prev => ({ ...prev, date: defaultDate }))
    } catch (error) {
      console.error('Error in loadData:', error)
      setPractitioners(fallbackPractitioners)
      setTherapies(fallbackTherapies)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {

      if (!profile) {
        throw new Error('User not authenticated')
      }

      // Validate required fields
      
      if (!formData.therapyId || !formData.practitionerId || !formData.date || !formData.time) {
        const missingFields = []
        if (!formData.therapyId) missingFields.push('Therapy Type')
        if (!formData.practitionerId) missingFields.push('Practitioner')
        if (!formData.date) missingFields.push('Date')
        if (!formData.time) missingFields.push('Time')
        
        toast({
          title: "Missing Required Fields",
          description: `Please fill in: ${missingFields.join(', ')}`,
          variant: "destructive",
        })
        return
      }

      const appointmentDateTime = new Date(`${formData.date}T${formData.time}:00`)
      
      // Get therapy duration from selected therapy
      const selectedTherapy = therapies.find(t => t.id === formData.therapyId)
      const duration = selectedTherapy?.duration_minutes || 60

      const appointmentData = {
        patientId: userType === 'patient' ? profile.id : formData.patientId,
        practitionerId: userType === 'practitioner' ? profile.id : formData.practitionerId,
        therapy: formData.therapy,
        appointmentDate: formData.date, // Just the date part
        appointmentTime: formData.time, // Just the time part
        duration: duration,
        notes: formData.notes,
      }


      if (isSupabaseReady) {
        const result = await AppointmentService.createAppointment(appointmentData)

        // Create notifications for both patient and practitioner
        try {
          // Patient notification - request forwarded
          await NotificationServiceClient.createNotification({
            userId: appointmentData.patientId,
            type: 'info',
            title: 'Appointment Request Submitted',
            message: `Your ${formData.therapy} appointment request with Dr. ${formData.practitioner} for ${new Date(appointmentDateTime).toLocaleDateString()} at ${new Date(appointmentDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} has been forwarded. You will receive a response soon.`,
            category: 'appointment',
            appointmentId: result.id
          })

          // Practitioner notification
          await NotificationServiceClient.createNotification({
            userId: appointmentData.practitionerId,
            type: 'alert',
            title: 'New Appointment Request',
            message: `New appointment request: ${formData.therapy} with patient on ${new Date(appointmentDateTime).toLocaleDateString()} at ${new Date(appointmentDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}. Please review and confirm.`,
            category: 'appointment',
            appointmentId: result.id
          })

        } catch (notificationError) {
          console.error('Error creating notifications:', notificationError)
          // Don't fail the appointment creation if notifications fail
        }
      } else {
        // Simulate appointment creation with mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      const appointmentDate = new Date(appointmentDateTime)
      const dateStr = appointmentDate.toLocaleDateString()
      const timeStr = appointmentDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })

      toast({
        title: "Appointment Booked Successfully!",
        description: `${formData.therapy} on ${dateStr} at ${timeStr} with Dr. ${formData.practitioner}`,
      })

      // Call the callback to refresh appointments
      if (onAppointmentBooked) {
        onAppointmentBooked()
      }

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
      console.error('Error details:', error instanceof Error ? error.message : String(error))
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment. Please try again.",
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
                    onValueChange={(value) => {
                      setFormData({ ...formData, time: value })
                    }}
                    disabled={!formData.date || !formData.practitionerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !formData.date || !formData.practitionerId 
                          ? "Select date and practitioner first" 
                          : "Select time"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
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

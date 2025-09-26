"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Loader2, Edit, X } from "lucide-react"
import { BookingModal } from "./booking-modal"
import { useAuth } from "@/contexts/auth-context"
import { AppointmentService, Appointment } from "@/lib/appointment-service"
import { useToast } from "@/hooks/use-toast"

interface AppointmentCalendarProps {
  userType: "patient" | "practitioner"
}

export function AppointmentCalendar({ userType }: AppointmentCalendarProps) {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  // Load appointments when component mounts or date changes
  useEffect(() => {
    if (profile) {
      loadAppointments()
    }
  }, [profile, currentDate])

  const loadAppointments = async () => {
    if (!profile) return
    
    setLoading(true)
    try {
      const data = await AppointmentService.getAppointments(profile.id, userType)
      setAppointments(data || [])
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointment_date).toISOString().split("T")[0]
      return aptDate === dateString
    })
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await AppointmentService.cancelAppointment(appointmentId, "Cancelled by user")
      toast({
        title: "Success",
        description: "Appointment cancelled successfully.",
      })
      loadAppointments() // Reload appointments
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await AppointmentService.completeAppointment(appointmentId, "Session completed")
      toast({
        title: "Success",
        description: "Appointment marked as completed.",
      })
      loadAppointments() // Reload appointments
    } catch (error) {
      console.error('Error completing appointment:', error)
      toast({
        title: "Error",
        description: "Failed to complete appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{userType === "patient" ? "My Appointments" : "Schedule Management"}</h2>
        <Button onClick={() => setShowBookingModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {userType === "patient" ? "Book Appointment" : "Add Appointment"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-2 h-20" />
                }

                const dayAppointments = getAppointmentsForDate(day)
                const isToday = day.toDateString() === new Date().toDateString()
                const isSelected = selectedDate?.toDateString() === day.toDateString()

                return (
                  <div
                    key={index}
                    className={`p-2 h-20 border rounded-lg cursor-pointer transition-colors ${
                      isToday
                        ? "bg-primary/10 border-primary"
                        : isSelected
                          ? "bg-secondary/10 border-secondary"
                          : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-sm font-medium">{day.getDate()}</div>
                    <div className="space-y-1 mt-1">
                      {dayAppointments.slice(0, 2).map((apt) => {
                        const aptTime = new Date(apt.appointment_date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })
                        return (
                          <div key={apt.id} className="text-xs p-1 bg-primary/20 text-primary rounded truncate">
                            {aptTime} {apt.therapy}
                          </div>
                        )
                      })}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayAppointments.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? `Appointments for ${selectedDate.toLocaleDateString()}` : "Select a date"}
            </CardTitle>
            <CardDescription>
              {selectedDate ? "View and manage appointments" : "Click on a date to view appointments"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading appointments...</span>
              </div>
            ) : selectedDate ? (
              <div className="space-y-4">
                {getAppointmentsForDate(selectedDate).length > 0 ? (
                  getAppointmentsForDate(selectedDate).map((appointment) => {
                    const aptTime = new Date(appointment.appointment_date).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })
                    const otherUser = userType === "patient" ? appointment.practitioners : appointment.patients
                    const otherUserName = otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Unknown'
                    
                    return (
                      <div key={appointment.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{appointment.therapy}</h4>
                          <Badge variant={
                            appointment.status === "confirmed" ? "default" :
                            appointment.status === "completed" ? "secondary" :
                            appointment.status === "cancelled" ? "destructive" :
                            "outline"
                          }>
                            {appointment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {aptTime} - {userType === "patient" ? `Dr. ${otherUserName}` : otherUserName}
                        </p>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground italic">
                            Notes: {appointment.notes}
                          </p>
                        )}
                        <div className="flex gap-2">
                          {appointment.status === "scheduled" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                              {userType === "practitioner" && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => handleCompleteAppointment(appointment.id)}
                                >
                                  Complete
                                </Button>
                              )}
                            </>
                          )}
                          {appointment.status === "confirmed" && userType === "practitioner" && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleCompleteAppointment(appointment.id)}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-8">No appointments scheduled for this date</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Select a date to view appointments</p>
            )}
          </CardContent>
        </Card>
      </div>

      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} userType={userType} />
    </div>
  )
}

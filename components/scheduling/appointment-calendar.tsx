"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { BookingModal } from "./booking-modal"

interface AppointmentCalendarProps {
  userType: "patient" | "practitioner"
}

export function AppointmentCalendar({ userType }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      date: "2024-01-15",
      time: "10:00",
      therapy: "Abhyanga",
      patient: "Sarah Johnson",
      practitioner: "Dr. Priya Sharma",
      status: "confirmed",
    },
    {
      id: 2,
      date: "2024-01-17",
      time: "14:00",
      therapy: "Shirodhara",
      patient: "Michael Chen",
      practitioner: "Dr. Raj Patel",
      status: "pending",
    },
    {
      id: 3,
      date: "2024-01-20",
      time: "16:00",
      therapy: "Panchakarma Consultation",
      patient: "Emma Wilson",
      practitioner: "Dr. Priya Sharma",
      status: "confirmed",
    },
  ]

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
    return appointments.filter((apt) => apt.date === dateString)
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
                      {dayAppointments.slice(0, 2).map((apt) => (
                        <div key={apt.id} className="text-xs p-1 bg-primary/20 text-primary rounded truncate">
                          {apt.time} {apt.therapy}
                        </div>
                      ))}
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
            {selectedDate ? (
              <div className="space-y-4">
                {getAppointmentsForDate(selectedDate).length > 0 ? (
                  getAppointmentsForDate(selectedDate).map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{appointment.therapy}</h4>
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time} - {userType === "patient" ? appointment.practitioner : appointment.patient}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))
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

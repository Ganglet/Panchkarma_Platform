"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Calendar, Clock, User, Stethoscope } from "lucide-react"
import { Appointment } from "@/lib/appointment-service"
import { AppointmentService } from "@/lib/appointment-service"
import { NotificationService } from "@/lib/notification-service"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface AppointmentAlertProps {
  appointment: Appointment
  onStatusChange: () => void
}

export function AppointmentAlert({ appointment, onStatusChange }: AppointmentAlertProps) {
  const { toast } = useToast()

  const handleAccept = async () => {
    console.log('Accept button clicked for appointment:', appointment.id)
    console.log('Appointment data:', appointment)
    
    try {
      // Test 0: Check authentication
      console.log('=== TEST 0: Checking authentication ===')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('Current user:', user)
      console.log('Auth error:', authError)
      if (!user) {
        throw new Error('User not authenticated')
      }
      console.log('✅ User is authenticated:', user.id)
      
    } catch (error) {
      console.error('❌ Authentication error:', error)
      toast({
        title: "Authentication Error",
        description: "Please log in again.",
        variant: "destructive",
      })
      return
    }
    
    try {
      // Test 1: Just try to update appointment status
      console.log('=== TEST 1: Updating appointment status ===')
      console.log('Appointment ID:', appointment.id)
      console.log('Current status:', appointment.status)
      
      const updateResult = await AppointmentService.updateAppointmentStatus(appointment.id, 'confirmed')
      console.log('Update result:', updateResult)
      console.log('✅ Appointment status updated successfully')

      // Test 2: Try to create notification
      console.log('=== TEST 2: Creating notification ===')
      console.log('Patient ID:', appointment.patient_id)
      
      const notificationResult = await NotificationService.createNotification({
        userId: appointment.patient_id,
        type: 'success',
        title: 'Appointment Confirmed!',
        message: `Your ${appointment.therapy} appointment has been confirmed by your practitioner for ${new Date(appointment.appointment_date).toLocaleDateString()} at ${new Date(appointment.appointment_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}.`,
        category: 'appointment',
        appointmentId: appointment.id
      })
      console.log('Notification result:', notificationResult)
      console.log('✅ Notification created successfully')

      // Test 3: Refresh dashboard
      console.log('=== TEST 3: Refreshing dashboard ===')
      onStatusChange()
      console.log('✅ Dashboard refresh called')

      toast({
        title: "Appointment Accepted",
        description: "The appointment has been confirmed and the patient has been notified.",
      })
      
    } catch (error) {
      console.error('❌ Error in handleAccept:', error)
      console.error('Error name:', error?.name)
      console.error('Error message:', error?.message)
      console.error('Error code:', error?.code)
      console.error('Error details:', error?.details)
      console.error('Error hint:', error?.hint)
      
      toast({
        title: "Error",
        description: `Failed to accept appointment: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      })
    }
  }

  const handleDecline = async () => {
    console.log('Decline button clicked for appointment:', appointment.id)
    try {
      console.log('Creating decline notification for patient:', appointment.patient_id)
      // Create notification for patient first
      await NotificationService.createNotification({
        userId: appointment.patient_id,
        type: 'warning',
        title: 'Appointment Declined',
        message: `Your ${appointment.therapy} appointment request has been declined by your practitioner due to being too busy. Please book another time.`,
        category: 'appointment',
        appointmentId: appointment.id
      })
      console.log('Notification created successfully')

      console.log('Deleting appointment from database:', appointment.id)
      // Delete the appointment from database
      await AppointmentService.deleteAppointment(appointment.id)
      console.log('Appointment deleted successfully')

      console.log('Appointment declined successfully')
      toast({
        title: "Appointment Declined",
        description: "The appointment has been declined and the patient has been notified.",
      })

      console.log('Calling onStatusChange callback')
      onStatusChange()
    } catch (error) {
      console.error('Error declining appointment:', error)
      console.error('Error details:', error instanceof Error ? error.message : String(error))
      toast({
        title: "Error",
        description: "Failed to decline appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const appointmentDate = new Date(appointment.appointment_date)
  const dateStr = appointmentDate.toLocaleDateString()
  const timeStr = appointmentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">New Appointment Request</CardTitle>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {appointment.status}
          </Badge>
        </div>
        <CardDescription>
          A patient has requested an appointment with you
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{timeStr}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Therapy:</span>
            <span className="text-sm">{appointment.therapy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Duration:</span>
            <span className="text-sm">{appointment.duration} minutes</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Notes:</span> {appointment.notes}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleAccept}
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button 
            onClick={handleDecline}
            size="sm"
            variant="destructive"
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

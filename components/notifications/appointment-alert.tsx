"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Calendar, Clock, User, Stethoscope, Loader2 } from "lucide-react"
import { Appointment, AppointmentServiceClient as AppointmentService } from "@/lib/appointment-service-client"
import { NotificationServiceClient } from "@/lib/notification-service-client"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface AppointmentAlertProps {
  appointment: Appointment
  onStatusChange: () => void
}

export function AppointmentAlert({ appointment, onStatusChange }: AppointmentAlertProps) {
  const { toast } = useToast()
  const [isProcessed, setIsProcessed] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeclining, setIsDeclining] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
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
      console.log('=== Confirming appointment via API ===')
      console.log('Appointment ID:', appointment.id)
      console.log('Current status:', appointment.status)
      
      // Use the API endpoint that handles both status update and notifications
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      const response = await fetch('/api/appointments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          status: 'confirmed',
          notes: 'Confirmed by practitioner',
          appointmentData: appointment // Send the full appointment data
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ API Error:', errorData)
        throw new Error(errorData.error || 'Failed to confirm appointment')
      }

      const result = await response.json()
      console.log('✅ Appointment confirmed successfully:', result)
      
      // Mark as processed to hide the card
      console.log('Setting isProcessed to true')
      setIsProcessed(true)
      console.log('isProcessed set to true')
      
      // Refresh dashboard
      onStatusChange()
      
      toast({
        title: "Appointment Confirmed",
        description: result.notificationsSent 
          ? "The appointment has been confirmed and email notifications sent."
          : "The appointment has been confirmed.",
        variant: "default",
      })
      
    } catch (error) {
      console.error('❌ Error in handleAccept:', error)
      
      toast({
        title: "Error",
        description: `Failed to confirm appointment: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsAccepting(false)
    }
  }

  const handleDecline = async () => {
    setIsDeclining(true)
    console.log('Decline button clicked for appointment:', appointment.id)
    try {
      // Use the API endpoint to decline the appointment
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      const response = await fetch('/api/appointments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          status: 'cancelled',
          notes: 'Declined by practitioner - too busy',
          appointmentData: appointment // Send the full appointment data
        })
      })

      console.log('Decline response status:', response.status)
      console.log('Decline response ok:', response.ok)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Decline API Error:', errorData)
        throw new Error(errorData.error || 'Failed to decline appointment')
      }

      const result = await response.json()
      console.log('✅ Appointment declined successfully:', result)

      // Mark as processed to hide the card
      console.log('Setting isProcessed to true (decline)')
      setIsProcessed(true)
      console.log('isProcessed set to true (decline)')

      // Notification is created on the server now (API). No client insert to avoid RLS 403.

      toast({
        title: "Appointment Declined",
        description: "The appointment has been declined and the patient has been notified.",
      })

      onStatusChange()
    } catch (error) {
      console.error('Error declining appointment:', error)
      console.error('Error details:', error instanceof Error ? error.message : String(error))
      toast({
        title: "Error",
        description: "Failed to decline appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeclining(false)
    }
  }

  const appointmentDate = new Date(appointment.appointment_date)
  const dateStr = appointmentDate.toLocaleDateString()
  const timeStr = appointmentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })

  // Don't render if already processed
  console.log('AppointmentAlert render - isProcessed:', isProcessed, 'appointmentId:', appointment.id)
  if (isProcessed) {
    console.log('AppointmentAlert: Hiding card because isProcessed is true')
    return null
  }

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
            disabled={isAccepting || isDeclining}
          >
            {isAccepting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            {isAccepting ? "Accepting..." : "Accept"}
          </Button>
          <Button 
            onClick={handleDecline}
            size="sm"
            variant="destructive"
            className="flex-1"
            disabled={isAccepting || isDeclining}
          >
            {isDeclining ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            {isDeclining ? "Declining..." : "Decline"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

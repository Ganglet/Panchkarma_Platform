"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Send, CheckCircle } from "lucide-react"
import { AppointmentServiceClient as AppointmentService, Appointment } from "@/lib/appointment-service-client"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface AppointmentConfirmationModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function AppointmentConfirmationModal({
  appointment,
  isOpen,
  onClose,
  onConfirm
}: AppointmentConfirmationModalProps) {
  const [notes, setNotes] = useState("")
  const [sendEmail, setSendEmail] = useState(true)
  const [sendSMS, setSendSMS] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  if (!appointment) return null

  const handleConfirm = async () => {
    setIsLoading(true)
    
    try {
      await AppointmentService.updateAppointmentStatus(
        appointment.id,
        'confirmed',
        notes || undefined
      )

      toast({
        title: "Appointment Confirmed",
        description: `Appointment confirmed successfully. ${sendEmail ? 'Email' : ''} ${sendEmail && sendSMS ? 'and' : ''} ${sendSMS ? 'SMS' : ''} notifications sent to patient.`,
        variant: "default"
      })

      onConfirm()
      onClose()
    } catch (error) {
      console.error('Error confirming appointment:', error)
      toast({
        title: "Error",
        description: "Failed to confirm appointment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Confirm Appointment
          </DialogTitle>
          <DialogDescription>
            Review appointment details and send confirmation notifications to the patient.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border"
          >
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Appointment Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Date & Time:</span>
                </div>
                <p className="text-sm text-gray-700 ml-6">
                  {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_date)}
                </p>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {appointment.therapy}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Patient:</span>
                </div>
                <p className="text-sm text-gray-700 ml-6">
                  {appointment.patient?.first_name} {appointment.patient?.last_name}
                </p>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {appointment.patient?.email}
                  </span>
                </div>

                {appointment.patient?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {appointment.patient.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Notification Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Send className="h-5 w-5 text-green-600" />
              Notification Options
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-email"
                  checked={sendEmail}
                  onCheckedChange={(checked) => setSendEmail(checked as boolean)}
                />
                <Label htmlFor="send-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email Confirmation
                  <Badge variant="secondary" className="text-xs">
                    via SendGrid
                  </Badge>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-sms"
                  checked={sendSMS}
                  onCheckedChange={(checked) => setSendSMS(checked as boolean)}
                />
                <Label htmlFor="send-sms" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Send SMS Confirmation
                  <Badge variant="secondary" className="text-xs">
                    via Twilio
                  </Badge>
                </Label>
              </div>
            </div>

            {(!appointment.patient?.email && sendEmail) && (
              <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Patient email not available. Email notification will be skipped.
              </p>
            )}

            {(!appointment.patient?.phone && sendSMS) && (
              <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Patient phone number not available. SMS notification will be skipped.
              </p>
            )}
          </motion.div>

          {/* Practitioner Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="notes" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Practitioner Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about the appointment confirmation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </motion.div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confirming...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Appointment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

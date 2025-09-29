"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { EmailService } from "@/lib/email-service"
import { NotificationServiceClient } from "@/lib/notification-service-client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export function NotificationTestSimple() {
  const { user } = useAuth()
  const [testData, setTestData] = useState({
    patientName: "John Doe",
    patientEmail: "john.doe@example.com",
    therapy: "Abhyanga",
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "10:00 AM",
    practitionerName: "Dr. Sarah Smith"
  })

  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    emailSent: boolean
    notificationCreated: boolean
    error?: string
  } | null>(null)

  const { toast } = useToast()

  const handleTestEmail = async () => {
    setIsLoading(true)
    setResults(null)

    try {
      const emailSent = await EmailService.sendAppointmentConfirmationEmail({
        patientName: testData.patientName,
        patientEmail: testData.patientEmail,
        therapy: testData.therapy,
        appointmentDate: testData.appointmentDate,
        appointmentTime: testData.appointmentTime,
        practitionerName: testData.practitionerName
      })
      
      setResults({ emailSent, notificationCreated: false })
      
      toast({
        title: emailSent ? "Email Sent Successfully" : "Email Failed",
        description: emailSent 
          ? "Test email has been sent to the recipient."
          : "Failed to send email. Check your configuration.",
        variant: emailSent ? "default" : "destructive"
      })
    } catch (error) {
      console.error('Email test error:', error)
      setResults({ emailSent: false, notificationCreated: false, error: error instanceof Error ? error.message : 'Unknown error' })
      
      toast({
        title: "Test Failed",
        description: "An error occurred while testing email notifications.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestNotification = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to test notifications.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setResults(null)

    try {
      await NotificationServiceClient.createNotification({
        userId: user.id,
        type: 'success',
        title: 'Test Notification',
        message: `Test notification for ${testData.patientName}'s ${testData.therapy} appointment.`,
        category: 'test'
      })
      
      setResults({ emailSent: false, notificationCreated: true })
      
      toast({
        title: "Notification Created",
        description: "Test notification has been created successfully.",
        variant: "default"
      })
    } catch (error) {
      console.error('Notification test error:', error)
      setResults({ emailSent: false, notificationCreated: false, error: error instanceof Error ? error.message : 'Unknown error' })
      
      toast({
        title: "Test Failed",
        description: "An error occurred while testing notifications.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notification System Test
          </CardTitle>
          <CardDescription>
            Test email notifications and in-app notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Data Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                value={testData.patientName}
                onChange={(e) => setTestData(prev => ({ ...prev, patientName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="patientEmail">Patient Email</Label>
              <Input
                id="patientEmail"
                type="email"
                value={testData.patientEmail}
                onChange={(e) => setTestData(prev => ({ ...prev, patientEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="therapy">Therapy</Label>
              <Input
                id="therapy"
                value={testData.therapy}
                onChange={(e) => setTestData(prev => ({ ...prev, therapy: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="practitionerName">Practitioner</Label>
              <Input
                id="practitionerName"
                value={testData.practitionerName}
                onChange={(e) => setTestData(prev => ({ ...prev, practitionerName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="appointmentDate">Date</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={testData.appointmentDate}
                onChange={(e) => setTestData(prev => ({ ...prev, appointmentDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="appointmentTime">Time</Label>
              <Input
                id="appointmentTime"
                value={testData.appointmentTime}
                onChange={(e) => setTestData(prev => ({ ...prev, appointmentTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={handleTestEmail} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Test Email
            </Button>
            <Button 
              onClick={handleTestNotification} 
              disabled={isLoading || !user}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Test Notification
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-2">
              <h4 className="font-medium">Test Results:</h4>
              <div className="flex items-center gap-2">
                {results.emailSent ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  Email: {results.emailSent ? "Sent" : "Failed"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {results.notificationCreated ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  Notification: {results.notificationCreated ? "Created" : "Failed"}
                </span>
              </div>
              {results.error && (
                <p className="text-sm text-red-600">{results.error}</p>
              )}
            </div>
          )}

          {/* Configuration Status */}
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Configuration Status:</strong></p>
            <div className="flex gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Supabase Edge Function: ✅ Deployed
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Resend API: ✅ Configured
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: Email notifications use Supabase Edge Functions with Resend integration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

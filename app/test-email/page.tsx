'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function TestEmailPage() {
  const [email, setEmail] = useState('angshumanchakravertty2@gmail.com') // Pre-fill with your email
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const sendTestEmail = async () => {
    setLoading(true)
    setStatus('Sending...')
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'confirmation',
          appointmentData: {
            patientName: 'Test User',
            patientEmail: email,
            practitionerName: 'Dr. Test',
            date: 'January 15, 2024',
            time: '10:00 AM',
            therapy: 'Vamana Therapy',
            location: 'Panchakarma Center'
          }
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setStatus(`✅ Email sent successfully! Message ID: ${result.messageId}`)
      } else {
        setStatus(`❌ Email failed: ${result.error || result.message}`)
        console.error('Email API error:', result)
      }
    } catch (error: any) {
      setStatus(`❌ Error sending test email: ${error.message}`)
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Email Sending</CardTitle>
          <CardDescription>Send a test appointment confirmation email with the new professional template.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button onClick={sendTestEmail} disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Test Email'}
          </Button>
          {status && (
            <p className={`text-sm ${status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
          )}
        </CardContent>
        <CardFooter className="text-xs text-gray-500">
          Make sure your Gmail SMTP credentials are set in .env.local and your dev server is restarted.
        </CardFooter>
      </Card>
    </div>
  )
}
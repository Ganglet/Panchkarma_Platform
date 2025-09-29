import { NextRequest, NextResponse } from 'next/server'
import { sendAppointmentConfirmation, sendAppointmentReminder } from '@/lib/server-email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, appointmentData } = body

    if (!type || !appointmentData) {
      return NextResponse.json(
        { error: 'Missing required fields: type and appointmentData' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'confirmation':
        result = await sendAppointmentConfirmation(appointmentData)
        break
      case 'reminder':
        result = await sendAppointmentReminder(appointmentData)
        break
      case 'cancellation':
        // For cancellation, we'll use the confirmation template with modified content
        result = await sendAppointmentConfirmation(appointmentData)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid email type. Must be: confirmation, reminder, or cancellation' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// SMS service - only runs on server side
// Twilio is imported dynamically to avoid browser bundling issues

export interface SMSTemplate {
  to: string
  message: string
}

export class SMSService {
  private static isConfigured(): boolean {
    // Only check configuration on server side
    if (typeof window !== 'undefined') {
      return false // Don't run in browser
    }
    
    return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER)
  }

  static async sendSMS(template: SMSTemplate): Promise<boolean> {
    // Don't run in browser environment
    if (typeof window !== 'undefined') {
      console.warn('SMS service only runs on server side')
      return false
    }

    if (!this.isConfigured()) {
      console.warn('Twilio not configured. SMS not sent to:', template.to)
      return false
    }

    try {
      // Dynamic import to avoid bundling Twilio in browser
      const twilio = await import('twilio')
      
      const twilioClient = twilio.default(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      )

      const message = await twilioClient.messages.create({
        body: template.message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: template.to
      })

      console.log('✅ SMS sent successfully to:', template.to, 'Message SID:', message.sid)
      return true
    } catch (error) {
      console.error('❌ Error sending SMS:', error)
      return false
    }
  }

  static generateAppointmentConfirmationSMS(
    patientName: string,
    therapy: string,
    appointmentDate: string,
    appointmentTime: string,
    practitionerName: string
  ): SMSTemplate {
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    const message = `🕉️ Panchakarma Wellness

Hi ${patientName}! Your appointment is confirmed:

📅 ${therapy}
📆 ${formattedDate} at ${appointmentTime}
👨‍⚕️ Dr. ${practitionerName}

📋 Reminders:
• Arrive 15 mins early
• Wear comfortable clothes
• Avoid heavy meals 2hrs before

Need to reschedule? Contact us 24hrs in advance.

Best regards,
Panchakarma Team`

    return {
      to: '', // Will be set when sending
      message
    }
  }

  static generateAppointmentReminderSMS(
    patientName: string,
    therapy: string,
    appointmentDate: string,
    appointmentTime: string,
    practitionerName: string
  ): SMSTemplate {
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })

    const message = `🕉️ Panchakarma Reminder

Hi ${patientName}! Your appointment is tomorrow:

📅 ${therapy}
📆 ${formattedDate} at ${appointmentTime}
👨‍⚕️ Dr. ${practitionerName}

Quick tips:
• Arrive 15 mins early
• Wear comfortable clothes
• Stay hydrated

See you soon!
Panchakarma Team`

    return {
      to: '',
      message
    }
  }

  static generateAppointmentCancellationSMS(
    patientName: string,
    therapy: string,
    appointmentDate: string,
    reason?: string
  ): SMSTemplate {
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    const message = `🕉️ Panchakarma Update

Hi ${patientName}, your appointment has been cancelled:

📅 ${therapy}
📆 ${formattedDate}
${reason ? `Reason: ${reason}` : ''}

To reschedule, please contact us at your earliest convenience.

We apologize for any inconvenience.

Panchakarma Team`

    return {
      to: '',
      message
    }
  }

  static generatePostProcedureSMS(
    patientName: string,
    therapy: string,
    instructions: string
  ): SMSTemplate {
    const message = `🕉️ Panchakarma Care

Hi ${patientName}! Post-${therapy} care:

${instructions}

Rest well and stay hydrated. Contact us if you have any concerns.

Best regards,
Panchakarma Team`

    return {
      to: '',
      message
    }
  }
}

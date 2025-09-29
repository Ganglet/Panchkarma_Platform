import nodemailer from 'nodemailer'
import path from 'path'

interface AppointmentData {
  patientName: string
  patientEmail: string
  practitionerName: string
  date: string
  time: string
  therapy: string
  location?: string
}

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
})

export async function sendAppointmentConfirmation(appointmentData: AppointmentData) {
  try {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      throw new Error('Gmail SMTP configuration missing. Please check your environment variables.')
    }

    const mailOptions = {
      from: `Panchakarma Wellness <${GMAIL_USER}>`,
      to: appointmentData.patientEmail,
      subject: `Appointment Confirmed - ${appointmentData.therapy} on ${appointmentData.date}`,
      attachments: [
        {
          filename: 'panchakarma-logo.png',
          path: path.join(process.cwd(), 'public', 'panchakarma-logo.png'),
          cid: 'panchakarma-logo'
        }
      ],
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Appointment Confirmation - Panchakarma Wellness</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .logo { max-width: 80px; height: auto; margin-bottom: 20px; }
              .content { background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .appointment-details { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2c5530; }
              .therapy-badge { background: #2c5530; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin: 10px 0; }
              .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
              ul { padding-left: 20px; }
              li { margin-bottom: 10px; color: #555; }
              h1 { margin: 0; font-size: 28px; font-weight: 300; }
              h2 { margin: 10px 0 0 0; font-size: 20px; font-weight: 400; opacity: 0.9; }
              h3 { color: #2c5530; font-size: 18px; margin-bottom: 15px; }
              .highlight { background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 3px solid #2c5530; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="cid:panchakarma-logo" alt="Panchakarma Wellness" class="logo" />
                <h1>Panchakarma Wellness</h1>
                <h2>Appointment Confirmed</h2>
              </div>
              
              <div class="content">
                <p>Dear ${appointmentData.patientName},</p>
                <p>We are pleased to confirm that your appointment has been successfully scheduled with our wellness center.</p>
                
                <div class="appointment-details">
                  <h3>Appointment Details</h3>
                  <div class="therapy-badge">${appointmentData.therapy}</div>
                  <p><strong>Date:</strong> ${appointmentData.date}</p>
                  <p><strong>Time:</strong> ${appointmentData.time}</p>
                  <p><strong>Practitioner:</strong> ${appointmentData.practitionerName}</p>
                  ${appointmentData.location ? `<p><strong>Location:</strong> ${appointmentData.location}</p>` : ''}
                </div>
                
                <div class="highlight">
                  <h3>Pre-Appointment Guidelines</h3>
                  <ul>
                    <li>Please arrive 15 minutes before your scheduled appointment time</li>
                    <li>Avoid consuming heavy meals 2 hours prior to your session</li>
                    <li>Wear comfortable, loose-fitting clothing suitable for treatment</li>
                    <li>Bring a comprehensive list of any medications you are currently taking</li>
                    <li>Ensure adequate hydration and rest the night before your appointment</li>
                  </ul>
                </div>
                
                <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance to avoid any cancellation fees.</p>
                
                <p>We look forward to supporting your wellness journey and providing you with exceptional care.</p>
                
                <p>Best regards,<br>
                <strong>The Panchakarma Wellness Team</strong></p>
              </div>
              
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>For inquiries, please contact us through our official channels.</p>
                <p>© 2024 Panchakarma Wellness Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Confirmation email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('Error sending confirmation email:', error)
    return { success: false, error: error.message }
  }
}

export async function sendAppointmentReminder(appointmentData: AppointmentData) {
  try {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      throw new Error('Gmail SMTP configuration missing. Please check your environment variables.')
    }

    const mailOptions = {
      from: `Panchakarma Wellness <${GMAIL_USER}>`,
      to: appointmentData.patientEmail,
      subject: `Reminder: Your ${appointmentData.therapy} Appointment Tomorrow`,
      attachments: [
        {
          filename: 'panchakarma-logo.png',
          path: path.join(process.cwd(), 'public', 'panchakarma-logo.png'),
          cid: 'panchakarma-logo'
        }
      ],
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Appointment Reminder - Panchakarma Wellness</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .logo { max-width: 80px; height: auto; margin-bottom: 20px; }
              .content { background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .appointment-details { background: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d97706; }
              .therapy-badge { background: #d97706; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin: 10px 0; }
              .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
              h1 { margin: 0; font-size: 28px; font-weight: 300; }
              h2 { margin: 10px 0 0 0; font-size: 20px; font-weight: 400; opacity: 0.9; }
              h3 { color: #d97706; font-size: 18px; margin-bottom: 15px; }
              .reminder-note { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 3px solid #d97706; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="cid:panchakarma-logo" alt="Panchakarma Wellness" class="logo" />
                <h1>Panchakarma Wellness</h1>
                <h2>Appointment Reminder</h2>
              </div>
              
              <div class="content">
                <p>Dear ${appointmentData.patientName},</p>
                <p>This is a friendly reminder about your upcoming appointment with our wellness center.</p>
                
                <div class="appointment-details">
                  <h3>Appointment Details</h3>
                  <div class="therapy-badge">${appointmentData.therapy}</div>
                  <p><strong>Date:</strong> ${appointmentData.date}</p>
                  <p><strong>Time:</strong> ${appointmentData.time}</p>
                  <p><strong>Practitioner:</strong> ${appointmentData.practitionerName}</p>
                  ${appointmentData.location ? `<p><strong>Location:</strong> ${appointmentData.location}</p>` : ''}
                </div>
                
                <div class="reminder-note">
                  <p><strong>Important:</strong> Please arrive 15 minutes before your scheduled appointment time to allow for check-in and preparation.</p>
                </div>
                
                <p>We look forward to providing you with exceptional care and supporting your wellness journey.</p>
                
                <p>Best regards,<br>
                <strong>The Panchakarma Wellness Team</strong></p>
              </div>
              
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>For inquiries, please contact us through our official channels.</p>
                <p>© 2024 Panchakarma Wellness Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Reminder email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('Error sending reminder email:', error)
    return { success: false, error: error.message }
  }
}
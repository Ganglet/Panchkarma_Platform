import { supabase } from './supabase'
import { EmailService } from './email-service'
import { SMSService } from './sms-service'

export interface NotificationData {
  userId: string
  type: 'reminder' | 'alert' | 'info' | 'success' | 'warning'
  title: string
  message: string
  category?: 'pre_procedure' | 'post_procedure' | 'appointment' | 'general' | 'therapy_update'
  therapyId?: string
  appointmentId?: string
  scheduledFor?: string
}

export interface AppointmentConfirmationData {
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone?: string
  therapy: string
  appointmentDate: string
  appointmentTime: string
  practitionerName: string
  clinicName?: string
}

export class NotificationService {
  static async createNotification(data: NotificationData) {
    console.log('Creating notification with data:', data)
    
    const notificationData = {
      user_id: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      category: data.category,
      therapy_id: data.therapyId,
      appointment_id: data.appointmentId,
      scheduled_for: data.scheduledFor,
      read: false,
      sent_email: false,
      sent_sms: false,
    }
    
    console.log('Notification data to insert:', notificationData)
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      console.error('Error details:', error.message)
      throw error
    }

    console.log('Notification created successfully:', notification)
    return notification
  }

  static async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }

    return data
  }

  static async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  static async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  static async scheduleAppointmentReminder(appointmentId: string, userId: string, appointmentDate: string, therapy: string) {
    const reminderTime = new Date(appointmentDate)
    reminderTime.setHours(reminderTime.getHours() - 2) // 2 hours before

    return this.createNotification({
      userId,
      type: 'reminder',
      title: 'Upcoming Appointment',
      message: `Your ${therapy} session is scheduled in 2 hours. Please prepare according to the guidelines.`,
      category: 'appointment',
      appointmentId,
      scheduledFor: reminderTime.toISOString(),
    })
  }

  static async schedulePreProcedureReminder(appointmentId: string, userId: string, therapy: string, instructions: string) {
    const appointmentTime = new Date()
    appointmentTime.setHours(appointmentTime.getHours() + 24) // 24 hours before

    return this.createNotification({
      userId,
      type: 'reminder',
      title: 'Pre-Procedure Preparation',
      message: `Please follow these preparation instructions for your ${therapy} session: ${instructions}`,
      category: 'pre_procedure',
      appointmentId,
      scheduledFor: appointmentTime.toISOString(),
    })
  }

  static async schedulePostProcedureReminder(appointmentId: string, userId: string, therapy: string, instructions: string) {
    const reminderTime = new Date()
    reminderTime.setHours(reminderTime.getHours() + 1) // 1 hour after

    return this.createNotification({
      userId,
      type: 'info',
      title: 'Post-Procedure Care',
      message: `Please follow these care instructions after your ${therapy} session: ${instructions}`,
      category: 'post_procedure',
      appointmentId,
      scheduledFor: reminderTime.toISOString(),
    })
  }

  static async sendFeedbackReminder(appointmentId: string, userId: string, therapy: string) {
    const reminderTime = new Date()
    reminderTime.setHours(reminderTime.getHours() + 2) // 2 hours after session

    return this.createNotification({
      userId,
      type: 'info',
      title: 'Session Feedback Requested',
      message: `Please provide feedback about your ${therapy} session to help us improve your treatment.`,
      category: 'general',
      appointmentId,
      scheduledFor: reminderTime.toISOString(),
    })
  }

  static async sendProgressUpdate(userId: string, therapy: string, progress: string) {
    return this.createNotification({
      userId,
      type: 'success',
      title: 'Progress Update',
      message: `Great progress on your ${therapy} treatment! ${progress}`,
      category: 'therapy_update',
    })
  }

  static async sendAppointmentConfirmation(appointmentId: string, userId: string, therapy: string, date: string, time: string) {
    return this.createNotification({
      userId,
      type: 'success',
      title: 'Appointment Confirmed',
      message: `Your ${therapy} session has been confirmed for ${date} at ${time}.`,
      category: 'appointment',
      appointmentId,
    })
  }

  static async sendAppointmentConfirmationWithEmailAndSMS(data: AppointmentConfirmationData) {
    console.log('Sending appointment confirmation with email and SMS:', data)
    
    // Create in-app notification
    const notification = await this.createNotification({
      userId: data.patientId,
      type: 'success',
      title: 'Appointment Confirmed',
      message: `Your ${data.therapy} session has been confirmed for ${data.appointmentDate} at ${data.appointmentTime}.`,
      category: 'appointment',
    })

    // Send email confirmation
    let emailSent = false
    if (data.patientEmail) {
      try {
        emailSent = await EmailService.sendAppointmentConfirmationEmail({
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          therapy: data.therapy,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          practitionerName: data.practitionerName,
          clinicName: data.clinicName
        })
      } catch (error) {
        console.error('Error sending confirmation email:', error)
      }
    }

    // Send SMS confirmation
    let smsSent = false
    if (data.patientPhone) {
      try {
        const smsTemplate = SMSService.generateAppointmentConfirmationSMS(
          data.patientName,
          data.therapy,
          data.appointmentDate,
          data.appointmentTime,
          data.practitionerName
        )
        smsTemplate.to = data.patientPhone
        smsSent = await SMSService.sendSMS(smsTemplate)
      } catch (error) {
        console.error('Error sending confirmation SMS:', error)
      }
    }

    // Update notification with delivery status
    if (notification) {
      await supabase
        .from('notifications')
        .update({
          sent_email: emailSent,
          sent_sms: smsSent,
          updated_at: new Date().toISOString()
        })
        .eq('id', notification.id)
    }

    return {
      notification,
      emailSent,
      smsSent
    }
  }

  static async sendAppointmentReminderWithEmailAndSMS(
    patientId: string,
    patientName: string,
    patientEmail: string,
    patientPhone: string,
    therapy: string,
    appointmentDate: string,
    appointmentTime: string,
    practitionerName: string
  ) {
    console.log('Sending appointment reminder with email and SMS')

    // Send email reminder
    let emailSent = false
    if (patientEmail) {
      try {
        emailSent = await EmailService.sendAppointmentReminderEmail({
          patientName,
          patientEmail,
          therapy,
          appointmentDate,
          appointmentTime,
          practitionerName
        })
      } catch (error) {
        console.error('Error sending reminder email:', error)
      }
    }

    // Send SMS reminder
    let smsSent = false
    if (patientPhone) {
      try {
        const smsTemplate = SMSService.generateAppointmentReminderSMS(
          patientName,
          therapy,
          appointmentDate,
          appointmentTime,
          practitionerName
        )
        smsTemplate.to = patientPhone
        smsSent = await SMSService.sendSMS(smsTemplate)
      } catch (error) {
        console.error('Error sending reminder SMS:', error)
      }
    }

    return {
      emailSent,
      smsSent
    }
  }

  static async sendAppointmentCancellation(appointmentId: string, userId: string, therapy: string, reason?: string) {
    return this.createNotification({
      userId,
      type: 'alert',
      title: 'Appointment Cancelled',
      message: `Your ${therapy} session has been cancelled. ${reason ? `Reason: ${reason}` : ''}`,
      category: 'appointment',
      appointmentId,
    })
  }
}


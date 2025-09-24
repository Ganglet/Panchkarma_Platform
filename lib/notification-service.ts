import { supabase } from './supabase'

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

export class NotificationService {
  static async createNotification(data: NotificationData) {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
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
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      throw error
    }

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

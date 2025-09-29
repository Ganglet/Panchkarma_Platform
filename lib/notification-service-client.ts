// Client-safe notification service (browser only)
import { supabase } from './supabase'

export interface NotificationData {
  userId: string
  type: 'reminder' | 'alert' | 'info' | 'success' | 'warning'
  title: string
  message: string
  category?: 'pre_procedure' | 'post_procedure' | 'appointment' | 'general' | 'therapy_update'
  appointmentId?: string // Will be mapped to appointment_id in database
  therapyId?: string // Will be mapped to therapy_id in database
  metadata?: Record<string, any> // Keep for interface compatibility but don't use in database
}

export class NotificationServiceClient {
  static async createNotification(data: NotificationData) {
    const insertData: any = {
      user_id: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      category: data.category || 'general',
      read: false,
      created_at: new Date().toISOString()
    }

    // Add optional fields if provided
    if (data.appointmentId) {
      insertData.appointment_id = data.appointmentId
    }
    if (data.therapyId) {
      insertData.therapy_id = data.therapyId
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
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
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  static async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  static async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  static async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error getting unread count:', error)
      throw error
    }

    return count || 0
  }
}

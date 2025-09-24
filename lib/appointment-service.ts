import { supabase } from './supabase'
import { NotificationService } from './notification-service'

export interface AppointmentData {
  patientId: string
  practitionerId: string
  therapy: string
  appointmentDate: string
  duration: number
  notes?: string
}

export interface Appointment {
  id: string
  patient_id: string
  practitioner_id: string
  therapy: string
  appointment_date: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  practitioner_notes?: string
  patient_notes?: string
  follow_up_required: boolean
  follow_up_date?: string
  created_at: string
  updated_at: string
  practitioners?: any
  patients?: any
}

export class AppointmentService {
  static async createAppointment(data: AppointmentData) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: data.patientId,
        practitioner_id: data.practitionerId,
        therapy: data.therapy,
        appointment_date: data.appointmentDate,
        duration: data.duration,
        notes: data.notes,
        status: 'scheduled',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating appointment:', error)
      throw error
    }

    // Schedule notifications
    try {
      await NotificationService.scheduleAppointmentReminder(
        appointment.id,
        data.patientId,
        data.appointmentDate,
        data.therapy
      )

      await NotificationService.schedulePreProcedureReminder(
        appointment.id,
        data.patientId,
        data.therapy,
        'Please avoid heavy meals 2 hours before your session.'
      )

      await NotificationService.sendAppointmentConfirmation(
        appointment.id,
        data.patientId,
        data.therapy,
        new Date(data.appointmentDate).toLocaleDateString(),
        new Date(data.appointmentDate).toLocaleTimeString()
      )
    } catch (notificationError) {
      console.error('Error scheduling notifications:', notificationError)
    }

    return appointment
  }

  static async getAppointments(userId: string, userType: 'patient' | 'practitioner') {
    const query = supabase
      .from('appointments')
      .select(`
        *,
        practitioners:profiles!appointments_practitioner_id_fkey(*),
        patients:profiles!appointments_patient_id_fkey(*)
      `)
      .order('appointment_date', { ascending: true })

    if (userType === 'patient') {
      query.eq('patient_id', userId)
    } else {
      query.eq('practitioner_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching appointments:', error)
      throw error
    }

    return data
  }

  static async getUpcomingAppointments(userId: string, userType: 'patient' | 'practitioner', limit: number = 5) {
    const now = new Date().toISOString()
    
    const query = supabase
      .from('appointments')
      .select(`
        *,
        practitioners:profiles!appointments_practitioner_id_fkey(*),
        patients:profiles!appointments_patient_id_fkey(*)
      `)
      .gte('appointment_date', now)
      .in('status', ['scheduled', 'confirmed'])
      .order('appointment_date', { ascending: true })
      .limit(limit)

    if (userType === 'patient') {
      query.eq('patient_id', userId)
    } else {
      query.eq('practitioner_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching upcoming appointments:', error)
      throw error
    }

    return data
  }

  static async updateAppointment(appointmentId: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single()

    if (error) {
      console.error('Error updating appointment:', error)
      throw error
    }

    return data
  }

  static async cancelAppointment(appointmentId: string, reason?: string) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single()

    if (error) {
      console.error('Error cancelling appointment:', error)
      throw error
    }

    // Send cancellation notification
    try {
      await NotificationService.sendAppointmentCancellation(
        appointmentId,
        appointment.patient_id,
        appointment.therapy,
        reason
      )
    } catch (notificationError) {
      console.error('Error sending cancellation notification:', notificationError)
    }

    return appointment
  }

  static async completeAppointment(appointmentId: string, practitionerNotes?: string) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        status: 'completed',
        practitioner_notes: practitionerNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single()

    if (error) {
      console.error('Error completing appointment:', error)
      throw error
    }

    // Schedule post-procedure and feedback reminders
    try {
      await NotificationService.schedulePostProcedureReminder(
        appointmentId,
        appointment.patient_id,
        appointment.therapy,
        'Please rest for 30 minutes and avoid cold water for 2 hours.'
      )

      await NotificationService.sendFeedbackReminder(
        appointmentId,
        appointment.patient_id,
        appointment.therapy
      )
    } catch (notificationError) {
      console.error('Error scheduling post-appointment notifications:', notificationError)
    }

    return appointment
  }

  static async getAppointmentStats(userId: string, userType: 'patient' | 'practitioner') {
    const now = new Date().toISOString()
    
    // Get total appointments
    const { count: totalAppointments, error: totalError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq(userType === 'patient' ? 'patient_id' : 'practitioner_id', userId)

    if (totalError) {
      console.error('Error fetching total appointments:', totalError)
      throw totalError
    }

    // Get completed appointments
    const { count: completedAppointments, error: completedError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq(userType === 'patient' ? 'patient_id' : 'practitioner_id', userId)
      .eq('status', 'completed')

    if (completedError) {
      console.error('Error fetching completed appointments:', completedError)
      throw completedError
    }

    // Get upcoming appointments
    const { count: upcomingAppointments, error: upcomingError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq(userType === 'patient' ? 'patient_id' : 'practitioner_id', userId)
      .gte('appointment_date', now)
      .in('status', ['scheduled', 'confirmed'])

    if (upcomingError) {
      console.error('Error fetching upcoming appointments:', upcomingError)
      throw upcomingError
    }

    return {
      total: totalAppointments || 0,
      completed: completedAppointments || 0,
      upcoming: upcomingAppointments || 0,
      completionRate: totalAppointments ? Math.round((completedAppointments || 0) / totalAppointments * 100) : 0,
    }
  }

  static async getTherapyHistory(userId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('therapy, status, appointment_date')
      .eq('patient_id', userId)
      .eq('status', 'completed')
      .order('appointment_date', { ascending: false })

    if (error) {
      console.error('Error fetching therapy history:', error)
      throw error
    }

    // Group by therapy and count sessions
    const therapyStats = data.reduce((acc: any, appointment) => {
      const therapy = appointment.therapy
      if (!acc[therapy]) {
        acc[therapy] = { therapy, totalSessions: 0, completedSessions: 0 }
      }
      acc[therapy].totalSessions++
      if (appointment.status === 'completed') {
        acc[therapy].completedSessions++
      }
      return acc
    }, {})

    return Object.values(therapyStats)
  }
}

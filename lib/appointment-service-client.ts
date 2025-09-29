// Client-safe appointment service (browser only)
import { supabase } from './supabase'

export interface Appointment {
  id: string
  patient_id: string
  practitioner_id: string
  therapy_id?: string
  therapy: string
  appointment_date: string // This is a timestamp with timezone
  duration: number
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  practitioner_notes?: string
  patient_notes?: string
  follow_up_required?: boolean
  follow_up_date?: string
  created_at: string
  updated_at: string
  patient?: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  practitioner?: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
}

export class AppointmentServiceClient {
  static async getAppointments(userId: string, userType: 'patient' | 'practitioner') {
    const column = userType === 'patient' ? 'patient_id' : 'practitioner_id'
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!patient_id(*),
        practitioner:profiles!practitioner_id(*)
      `)
      .eq(column, userId)
      .order('appointment_date', { ascending: true })

    if (error) {
      console.error('Error fetching appointments:', error)
      throw error
    }

    return data as Appointment[]
  }

  static async getAppointment(appointmentId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!patient_id(*),
        practitioner:profiles!practitioner_id(*)
      `)
      .eq('id', appointmentId)
      .single()

    if (error) {
      console.error('Error fetching appointment:', error)
      throw error
    }

    return data as Appointment
  }

  static async createAppointment(appointmentData: {
    patientId?: string
    practitionerId?: string
    patient_id?: string
    practitioner_id?: string
    therapy: string
    appointmentDate?: string
    appointment_date?: string
    appointmentTime?: string
    appointment_time?: string
    duration?: number
    notes?: string
  }) {
    // Combine date and time into a single timestamp
    let appointmentDateTime: string
    if (appointmentData.appointmentDate && appointmentData.appointmentTime) {
      appointmentDateTime = new Date(`${appointmentData.appointmentDate}T${appointmentData.appointmentTime}:00`).toISOString()
    } else if (appointmentData.appointment_date && appointmentData.appointment_time) {
      appointmentDateTime = new Date(`${appointmentData.appointment_date}T${appointmentData.appointment_time}:00`).toISOString()
    } else if (appointmentData.appointmentDate) {
      appointmentDateTime = new Date(appointmentData.appointmentDate).toISOString()
    } else if (appointmentData.appointment_date) {
      appointmentDateTime = new Date(appointmentData.appointment_date).toISOString()
    } else {
      throw new Error('Appointment date is required')
    }

    // Normalize the data to match database schema
    const normalizedData = {
      patient_id: appointmentData.patientId || appointmentData.patient_id,
      practitioner_id: appointmentData.practitionerId || appointmentData.practitioner_id,
      therapy: appointmentData.therapy,
      appointment_date: appointmentDateTime, // Combined date and time
      duration: appointmentData.duration || 60, // Default to 60 minutes
      notes: appointmentData.notes,
      status: 'scheduled', // Use 'scheduled' instead of 'pending' to match schema
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert(normalizedData)
      .select(`
        *,
        patient:profiles!patient_id(*),
        practitioner:profiles!practitioner_id(*)
      `)
      .single()

    if (error) {
      console.error('Error creating appointment:', error)
      throw error
    }

    return data as Appointment
  }

  static async updateAppointmentStatus(appointmentId: string, status: Appointment['status'], notes?: string) {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (notes) {
      updateData.notes = notes
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select(`
        *,
        patient:profiles!patient_id(*),
        practitioner:profiles!practitioner_id(*)
      `)
      .single()

    if (error) {
      console.error('Error updating appointment status:', error)
      throw error
    }

    return data as Appointment
  }

  static async updateAppointment(appointmentId: string, updateData: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select(`
        *,
        patient:profiles!patient_id(*),
        practitioner:profiles!practitioner_id(*)
      `)
      .single()

    if (error) {
      console.error('Error updating appointment:', error)
      throw error
    }

    return data as Appointment
  }

  static async deleteAppointment(appointmentId: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId)

    if (error) {
      console.error('Error deleting appointment:', error)
      throw error
    }
  }

  static async getAvailableTimeSlots(practitionerId: string, date: string) {
    // Get existing appointments for the practitioner on the given date
    const { data: existingAppointments, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('practitioner_id', practitionerId)
      .eq('appointment_date', date)
      .in('status', ['pending', 'confirmed'])

    if (error) {
      console.error('Error fetching existing appointments:', error)
      throw error
    }

    // Generate time slots (9 AM to 5 PM, 1-hour slots)
    const timeSlots = []
    const startHour = 9
    const endHour = 17

    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`
      const isBooked = existingAppointments?.some(apt => apt.appointment_time === timeString)
      
      timeSlots.push({
        time: timeString,
        available: !isBooked
      })
    }

    return timeSlots
  }

  static async cancelAppointment(appointmentId: string, reason?: string) {
    return this.updateAppointmentStatus(appointmentId, 'cancelled', reason)
  }

  static async completeAppointment(appointmentId: string, notes?: string) {
    return this.updateAppointmentStatus(appointmentId, 'completed', notes)
  }
}

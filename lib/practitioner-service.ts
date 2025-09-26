import { supabase } from './supabase'
import { Profile } from './supabase'

export interface PractitionerProfile extends Profile {
  specialization?: string
  license_number?: string
  experience_years?: number
  bio?: string
  clinic_id?: string
}

export interface Clinic {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  website?: string
  description?: string
  services: string[]
  operating_hours: Record<string, any>
  created_at: string
  updated_at: string
}

export class PractitionerService {
  static async getAllPractitioners(): Promise<PractitionerProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        clinics(*)
      `)
      .eq('user_type', 'practitioner')
      .order('first_name', { ascending: true })

    if (error) {
      console.error('Error fetching practitioners:', error)
      throw error
    }

    return data || []
  }

  static async getPractitionerById(practitionerId: string): Promise<PractitionerProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        clinics(*)
      `)
      .eq('id', practitionerId)
      .eq('user_type', 'practitioner')
      .single()

    if (error) {
      console.error('Error fetching practitioner:', error)
      return null
    }

    return data
  }

  static async getPractitionersByClinic(clinicId: string): Promise<PractitionerProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        clinics(*)
      `)
      .eq('user_type', 'practitioner')
      .eq('clinic_id', clinicId)
      .order('first_name', { ascending: true })

    if (error) {
      console.error('Error fetching practitioners by clinic:', error)
      throw error
    }

    return data || []
  }

  static async getPractitionersBySpecialization(specialization: string): Promise<PractitionerProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        clinics(*)
      `)
      .eq('user_type', 'practitioner')
      .ilike('specialization', `%${specialization}%`)
      .order('first_name', { ascending: true })

    if (error) {
      console.error('Error fetching practitioners by specialization:', error)
      throw error
    }

    return data || []
  }

  static async updatePractitionerProfile(practitionerId: string, updates: Partial<PractitionerProfile>): Promise<PractitionerProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', practitionerId)
      .select()
      .single()

    if (error) {
      console.error('Error updating practitioner profile:', error)
      throw error
    }

    return data
  }

  static async getPractitionerStats(practitionerId: string) {
    const now = new Date().toISOString()
    
    // Get total patients
    const { count: totalPatients, error: patientsError } = await supabase
      .from('appointments')
      .select('patient_id', { count: 'exact', head: true })
      .eq('practitioner_id', practitionerId)

    if (patientsError) {
      console.error('Error fetching total patients:', patientsError)
      throw patientsError
    }

    // Get total appointments
    const { count: totalAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('practitioner_id', practitionerId)

    if (appointmentsError) {
      console.error('Error fetching total appointments:', appointmentsError)
      throw appointmentsError
    }

    // Get completed appointments
    const { count: completedAppointments, error: completedError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('practitioner_id', practitionerId)
      .eq('status', 'completed')

    if (completedError) {
      console.error('Error fetching completed appointments:', completedError)
      throw completedError
    }

    // Get today's appointments
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { count: todayAppointments, error: todayError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('practitioner_id', practitionerId)
      .gte('appointment_date', today.toISOString())
      .lt('appointment_date', tomorrow.toISOString())

    if (todayError) {
      console.error('Error fetching today\'s appointments:', todayError)
      throw todayError
    }

    // Get this week's appointments
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    const { count: weekAppointments, error: weekError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('practitioner_id', practitionerId)
      .gte('appointment_date', weekStart.toISOString())
      .lt('appointment_date', weekEnd.toISOString())

    if (weekError) {
      console.error('Error fetching week appointments:', weekError)
      throw weekError
    }

    return {
      totalPatients: totalPatients || 0,
      totalAppointments: totalAppointments || 0,
      completedAppointments: completedAppointments || 0,
      todayAppointments: todayAppointments || 0,
      weekAppointments: weekAppointments || 0,
      completionRate: totalAppointments ? Math.round((completedAppointments || 0) / totalAppointments * 100) : 0,
    }
  }

  static async getPractitionerPatients(practitionerId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        patient_id,
        patients:profiles!appointments_patient_id_fkey(*)
      `)
      .eq('practitioner_id', practitionerId)
      .order('appointment_date', { ascending: false })

    if (error) {
      console.error('Error fetching practitioner patients:', error)
      throw error
    }

    // Get unique patients
    const uniquePatients = data?.reduce((acc: any[], appointment: any) => {
      const patientId = appointment.patient_id
      if (!acc.find(p => p.id === patientId)) {
        acc.push(appointment.patients)
      }
      return acc
    }, []) || []

    return uniquePatients
  }

  static async getPractitionerSchedule(practitionerId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients:profiles!appointments_patient_id_fkey(*)
      `)
      .eq('practitioner_id', practitionerId)
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .order('appointment_date', { ascending: true })

    if (error) {
      console.error('Error fetching practitioner schedule:', error)
      throw error
    }

    return data || []
  }
}

export class ClinicService {
  static async getAllClinics(): Promise<Clinic[]> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching clinics:', error)
      throw error
    }

    return data || []
  }

  static async getClinicById(clinicId: string): Promise<Clinic | null> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', clinicId)
      .single()

    if (error) {
      console.error('Error fetching clinic:', error)
      return null
    }

    return data
  }

  static async createClinic(clinicData: Omit<Clinic, 'id' | 'created_at' | 'updated_at'>): Promise<Clinic> {
    const { data, error } = await supabase
      .from('clinics')
      .insert(clinicData)
      .select()
      .single()

    if (error) {
      console.error('Error creating clinic:', error)
      throw error
    }

    return data
  }

  static async updateClinic(clinicId: string, updates: Partial<Clinic>): Promise<Clinic> {
    const { data, error } = await supabase
      .from('clinics')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', clinicId)
      .select()
      .single()

    if (error) {
      console.error('Error updating clinic:', error)
      throw error
    }

    return data
  }
}

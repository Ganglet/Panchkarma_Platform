import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

// Check if we have real Supabase credentials
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Export a flag to check if Supabase is properly configured
export const isSupabaseReady = isSupabaseConfigured

// Database types
export interface Profile {
  id: string
  email: string
  user_type: 'patient' | 'practitioner' | 'admin'
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
  gender?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  clinic_id?: string
  specialization?: string
  license_number?: string
  experience_years?: number
  bio?: string
  avatar_url?: string
  notification_preferences: {
    email: boolean
    sms: boolean
    in_app: boolean
    pre_procedure: boolean
    post_procedure: boolean
    appointments: boolean
    reminders: boolean
    timing: string
  }
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  practitioner_id: string
  therapy_id?: string
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
  practitioners?: Profile
  patients?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: 'reminder' | 'alert' | 'info' | 'success' | 'warning'
  title: string
  message: string
  category?: 'pre_procedure' | 'post_procedure' | 'appointment' | 'general' | 'therapy_update'
  therapy_id?: string
  appointment_id?: string
  read: boolean
  sent_email: boolean
  sent_sms: boolean
  scheduled_for?: string
  created_at: string
  updated_at: string
}

export interface Feedback {
  id: string
  appointment_id: string
  patient_id: string
  rating?: number
  symptoms: string[]
  improvements: string[]
  side_effects: string[]
  overall_feeling?: string
  notes?: string
  follow_up_needed: boolean
  created_at: string
  updated_at: string
  appointments?: Appointment
}

export interface Therapy {
  id: string
  name: string
  description?: string
  duration_minutes: number
  category?: string
  pre_procedure_instructions?: string
  post_procedure_instructions?: string
  contraindications?: string
  benefits?: string
  created_at: string
  updated_at: string
}

export interface TreatmentPlan {
  id: string
  patient_id: string
  practitioner_id: string
  name: string
  description?: string
  total_sessions: number
  completed_sessions: number
  start_date: string
  expected_end_date?: string
  actual_end_date?: string
  status: string
  goals: string[]
  current_phase?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface WellnessMetric {
  id: string
  patient_id: string
  metric_name: string
  metric_value?: number
  metric_unit?: string
  notes?: string
  recorded_date: string
  created_at: string
}

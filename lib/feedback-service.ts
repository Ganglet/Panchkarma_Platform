import { supabase, isSupabaseReady } from './supabase'
import { MockDataService } from './mock-data-service'

export interface FeedbackData {
  appointmentId: string
  patientId: string
  rating?: number
  symptoms: string[]
  improvements: string[]
  sideEffects: string[]
  overallFeeling?: string
  notes?: string
  followUpNeeded: boolean
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
  appointments?: any
}

export class FeedbackService {
  static async createFeedback(data: FeedbackData): Promise<Feedback> {
    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert({
        appointment_id: data.appointmentId,
        patient_id: data.patientId,
        rating: data.rating,
        symptoms: data.symptoms,
        improvements: data.improvements,
        side_effects: data.sideEffects,
        overall_feeling: data.overallFeeling,
        notes: data.notes,
        follow_up_needed: data.followUpNeeded,
      })
      .select(`
        *,
        appointments(*)
      `)
      .single()

    if (error) {
      console.error('Error creating feedback:', error)
      throw error
    }

    return feedback
  }

  static async getFeedbackByAppointment(appointmentId: string): Promise<Feedback | null> {
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        appointments(*)
      `)
      .eq('appointment_id', appointmentId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No feedback found
      }
      console.error('Error fetching feedback:', error)
      throw error
    }

    return data
  }

  static async getFeedbackByPatient(patientId: string): Promise<Feedback[]> {
    // Use mock data for demo accounts
    if (patientId === 'demo-patient-1' || patientId.startsWith('demo-') || !isSupabaseReady) {
      console.log('Using mock data for patient feedback, patientId:', patientId)
      return await MockDataService.getPatientFeedback(patientId)
    }

    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        appointments(*)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching patient feedback:', error)
      throw error
    }

    return data || []
  }

  static async getFeedbackByPractitioner(practitionerId: string): Promise<Feedback[]> {
    // Use mock data for demo accounts
    if (practitionerId === 'demo-practitioner-1' || practitionerId.startsWith('demo-') || !isSupabaseReady) {
      console.log('Using mock data for practitioner feedback, practitionerId:', practitionerId)
      return await MockDataService.getFeedback(practitionerId)
    }

    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        appointments!inner(*)
      `)
      .eq('appointments.practitioner_id', practitionerId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching practitioner feedback:', error)
      throw error
    }

    return data || []
  }

  static async updateFeedback(feedbackId: string, updates: Partial<FeedbackData>): Promise<Feedback> {
    const { data, error } = await supabase
      .from('feedback')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', feedbackId)
      .select(`
        *,
        appointments(*)
      `)
      .single()

    if (error) {
      console.error('Error updating feedback:', error)
      throw error
    }

    return data
  }

  static async deleteFeedback(feedbackId: string): Promise<void> {
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', feedbackId)

    if (error) {
      console.error('Error deleting feedback:', error)
      throw error
    }
  }

  static async getFeedbackStats(practitionerId: string) {
    // Use mock data for demo accounts
    if (practitionerId === 'demo-practitioner-1' || practitionerId.startsWith('demo-') || !isSupabaseReady) {
      console.log('Using mock data for feedback stats, practitionerId:', practitionerId)
      return await MockDataService.getFeedbackStats(practitionerId)
    }

    const { data, error } = await supabase
      .from('feedback')
      .select(`
        rating,
        appointments!inner(*)
      `)
      .eq('appointments.practitioner_id', practitionerId)

    if (error) {
      console.error('Error fetching feedback stats:', error)
      throw error
    }

    const feedbacks = data || []
    const totalFeedbacks = feedbacks.length
    const averageRating = totalFeedbacks > 0 
      ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / totalFeedbacks 
      : 0

    const ratingDistribution = {
      5: feedbacks.filter(f => f.rating === 5).length,
      4: feedbacks.filter(f => f.rating === 4).length,
      3: feedbacks.filter(f => f.rating === 3).length,
      2: feedbacks.filter(f => f.rating === 2).length,
      1: feedbacks.filter(f => f.rating === 1).length,
    }

    return {
      totalFeedbacks,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    }
  }

  static async getRecentFeedback(practitionerId: string, limit: number = 5): Promise<Feedback[]> {
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        appointments!inner(*)
      `)
      .eq('appointments.practitioner_id', practitionerId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent feedback:', error)
      throw error
    }

    return data || []
  }
}

import { supabase } from './supabase'

export interface TherapyProgress {
  id: string
  patient_id: string
  therapy_id: string
  session_number: number
  appointment_id?: string
  progress_notes?: string
  symptoms_before: string[]
  symptoms_after: string[]
  improvements: string[]
  practitioner_assessment?: string
  next_session_recommendations?: string
  created_at: string
  updated_at: string
  appointments?: any
  therapies?: any
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

export class ProgressService {
  static async createTherapyProgress(data: Omit<TherapyProgress, 'id' | 'created_at' | 'updated_at'>): Promise<TherapyProgress> {
    const { data: progress, error } = await supabase
      .from('therapy_progress')
      .insert(data)
      .select(`
        *,
        appointments(*),
        therapies(*)
      `)
      .single()

    if (error) {
      console.error('Error creating therapy progress:', error)
      throw error
    }

    return progress
  }

  static async getTherapyProgress(patientId: string): Promise<TherapyProgress[]> {
    const { data, error } = await supabase
      .from('therapy_progress')
      .select(`
        *,
        appointments(*),
        therapies(*)
      `)
      .eq('patient_id', patientId)
      .order('session_number', { ascending: true })

    if (error) {
      console.error('Error fetching therapy progress:', error)
      throw error
    }

    return data || []
  }

  static async getTherapyProgressByPractitioner(practitionerId: string): Promise<TherapyProgress[]> {
    const { data, error } = await supabase
      .from('therapy_progress')
      .select(`
        *,
        appointments!inner(*),
        therapies(*)
      `)
      .eq('appointments.practitioner_id', practitionerId)
      .order('session_number', { ascending: true })

    if (error) {
      console.error('Error fetching therapy progress by practitioner:', error)
      throw error
    }

    return data || []
  }

  static async updateTherapyProgress(progressId: string, updates: Partial<TherapyProgress>): Promise<TherapyProgress> {
    const { data, error } = await supabase
      .from('therapy_progress')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', progressId)
      .select(`
        *,
        appointments(*),
        therapies(*)
      `)
      .single()

    if (error) {
      console.error('Error updating therapy progress:', error)
      throw error
    }

    return data
  }

  static async createTreatmentPlan(data: Omit<TreatmentPlan, 'id' | 'created_at' | 'updated_at'>): Promise<TreatmentPlan> {
    const { data: plan, error } = await supabase
      .from('treatment_plans')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Error creating treatment plan:', error)
      throw error
    }

    return plan
  }

  static async getTreatmentPlans(patientId: string): Promise<TreatmentPlan[]> {
    const { data, error } = await supabase
      .from('treatment_plans')
      .select('*')
      .eq('patient_id', patientId)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching treatment plans:', error)
      throw error
    }

    return data || []
  }

  static async getTreatmentPlansByPractitioner(practitionerId: string): Promise<TreatmentPlan[]> {
    const { data, error } = await supabase
      .from('treatment_plans')
      .select('*')
      .eq('practitioner_id', practitionerId)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching treatment plans by practitioner:', error)
      throw error
    }

    return data || []
  }

  static async updateTreatmentPlan(planId: string, updates: Partial<TreatmentPlan>): Promise<TreatmentPlan> {
    const { data, error } = await supabase
      .from('treatment_plans')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', planId)
      .select()
      .single()

    if (error) {
      console.error('Error updating treatment plan:', error)
      throw error
    }

    return data
  }

  static async createWellnessMetric(data: Omit<WellnessMetric, 'id' | 'created_at'>): Promise<WellnessMetric> {
    const { data: metric, error } = await supabase
      .from('wellness_metrics')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Error creating wellness metric:', error)
      throw error
    }

    return metric
  }

  static async getWellnessMetrics(patientId: string): Promise<WellnessMetric[]> {
    const { data, error } = await supabase
      .from('wellness_metrics')
      .select('*')
      .eq('patient_id', patientId)
      .order('recorded_date', { ascending: false })

    if (error) {
      console.error('Error fetching wellness metrics:', error)
      throw error
    }

    return data || []
  }

  static async getProgressStats(patientId: string) {
    const [progressData, treatmentPlans, wellnessMetrics] = await Promise.all([
      this.getTherapyProgress(patientId),
      this.getTreatmentPlans(patientId),
      this.getWellnessMetrics(patientId)
    ])

    const totalSessions = progressData.length
    const completedSessions = treatmentPlans.reduce((sum, plan) => sum + plan.completed_sessions, 0)
    const activePlans = treatmentPlans.filter(plan => plan.status === 'active').length

    // Calculate improvement trends
    const improvements = progressData.flatMap(p => p.improvements)
    const improvementCounts = improvements.reduce((acc: Record<string, number>, improvement) => {
      acc[improvement] = (acc[improvement] || 0) + 1
      return acc
    }, {})

    const topImprovements = Object.entries(improvementCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([improvement, count]) => ({ improvement, count }))

    return {
      totalSessions,
      completedSessions,
      activePlans,
      topImprovements,
      recentProgress: progressData.slice(0, 5),
      wellnessMetrics: wellnessMetrics.slice(0, 10)
    }
  }

  static async getPractitionerProgressStats(practitionerId: string) {
    const [progressData, treatmentPlans] = await Promise.all([
      this.getTherapyProgressByPractitioner(practitionerId),
      this.getTreatmentPlansByPractitioner(practitionerId)
    ])

    const totalSessions = progressData.length
    const activePlans = treatmentPlans.filter(plan => plan.status === 'active').length
    const completedPlans = treatmentPlans.filter(plan => plan.status === 'completed').length

    // Group by patient
    const patientProgress = progressData.reduce((acc: Record<string, any[]>, progress) => {
      const patientId = progress.patient_id
      if (!acc[patientId]) acc[patientId] = []
      acc[patientId].push(progress)
      return acc
    }, {})

    const uniquePatients = Object.keys(patientProgress).length

    return {
      totalSessions,
      activePlans,
      completedPlans,
      uniquePatients,
      recentProgress: progressData.slice(0, 10)
    }
  }
}

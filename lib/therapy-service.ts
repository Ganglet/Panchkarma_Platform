import { supabase } from './supabase'

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

export class TherapyService {
  static async getAllTherapies(): Promise<Therapy[]> {
    const { data, error } = await supabase
      .from('therapies')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching therapies:', error)
      throw error
    }

    return data || []
  }

  static async getTherapyById(therapyId: string): Promise<Therapy | null> {
    const { data, error } = await supabase
      .from('therapies')
      .select('*')
      .eq('id', therapyId)
      .single()

    if (error) {
      console.error('Error fetching therapy:', error)
      return null
    }

    return data
  }

  static async getTherapiesByCategory(category: string): Promise<Therapy[]> {
    const { data, error } = await supabase
      .from('therapies')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching therapies by category:', error)
      throw error
    }

    return data || []
  }

  static async getTherapyCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('therapies')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching therapy categories:', error)
      throw error
    }

    // Get unique categories
    const categories = [...new Set(data?.map(item => item.category).filter(Boolean))] as string[]
    return categories.sort()
  }

  static async createTherapy(therapyData: Omit<Therapy, 'id' | 'created_at' | 'updated_at'>): Promise<Therapy> {
    const { data, error } = await supabase
      .from('therapies')
      .insert(therapyData)
      .select()
      .single()

    if (error) {
      console.error('Error creating therapy:', error)
      throw error
    }

    return data
  }

  static async updateTherapy(therapyId: string, updates: Partial<Therapy>): Promise<Therapy> {
    const { data, error } = await supabase
      .from('therapies')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', therapyId)
      .select()
      .single()

    if (error) {
      console.error('Error updating therapy:', error)
      throw error
    }

    return data
  }

  static async deleteTherapy(therapyId: string): Promise<void> {
    const { error } = await supabase
      .from('therapies')
      .delete()
      .eq('id', therapyId)

    if (error) {
      console.error('Error deleting therapy:', error)
      throw error
    }
  }

  static async getPopularTherapies(limit: number = 5): Promise<Therapy[]> {
    // Get therapies with most appointments
    const { data, error } = await supabase
      .from('appointments')
      .select('therapy')
      .eq('status', 'completed')

    if (error) {
      console.error('Error fetching popular therapies:', error)
      throw error
    }

    // Count therapy occurrences
    const therapyCounts = data?.reduce((acc: Record<string, number>, appointment) => {
      const therapy = appointment.therapy
      acc[therapy] = (acc[therapy] || 0) + 1
      return acc
    }, {}) || {}

    // Get therapy details for popular ones
    const popularTherapyNames = Object.entries(therapyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([therapy]) => therapy)

    if (popularTherapyNames.length === 0) {
      // Fallback to all therapies if no completed appointments
      return this.getAllTherapies()
    }

    const { data: therapies, error: therapiesError } = await supabase
      .from('therapies')
      .select('*')
      .in('name', popularTherapyNames)

    if (therapiesError) {
      console.error('Error fetching popular therapy details:', therapiesError)
      throw therapiesError
    }

    // Sort by popularity
    return therapies?.sort((a, b) => {
      const aCount = therapyCounts[a.name] || 0
      const bCount = therapyCounts[b.name] || 0
      return bCount - aCount
    }) || []
  }
}

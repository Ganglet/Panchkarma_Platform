"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile, isSupabaseReady } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userType: string, firstName: string, lastName: string, clinicId?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  fetchProfile: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isSupabaseReady) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    if (!isSupabaseReady) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // If profile doesn't exist, try to create it from user metadata
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating from user metadata')
          await createProfileFromUser(userId)
        }
      } else {
        // Check if profile user_type matches metadata user_type
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          const metadataUserType = userData.user.user_metadata?.user_type
          if (metadataUserType && metadataUserType !== data.user_type) {
            // Auto-fix the user type
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ user_type: metadataUserType })
              .eq('id', userId)
            
            if (!updateError) {
              // Fetch the updated profile
              const { data: updatedData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
              
              if (updatedData) {
                setProfile(updatedData)
                return
              }
            }
          }
        }
        
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProfileFromUser = async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) return

      const user = userData.user
      const metadata = user.user_metadata || {}
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email || '',
          user_type: metadata.user_type || 'patient',
          first_name: metadata.first_name || '',
          last_name: metadata.last_name || '',
          clinic_id: metadata.clinic_id || null
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error creating profile from user:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      return { error: { message: 'Supabase not configured. Please set up your environment variables.' } }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (
    email: string, 
    password: string, 
    userType: string, 
    firstName: string, 
    lastName: string, 
    clinicId?: string
  ) => {
    if (!isSupabaseReady) {
      return { error: { message: 'Supabase not configured. Please set up your environment variables.' } }
    }
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
          clinic_id: clinicId
        }
      }
    })

    if (data.user && !error) {
      // Manually create profile to ensure it's created correctly
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: email,
          user_type: userType,
          first_name: firstName,
          last_name: lastName,
          clinic_id: clinicId || null
        })
      
      if (profileError) {
        console.error('Error creating profile manually:', profileError)
      }
    }
  
    return { error }
  }

  const signOut = async () => {
    if (isSupabaseReady) {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    fetchProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

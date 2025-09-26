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
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log('🔧 AuthProvider: Initializing auth context')
    console.log('🔧 AuthProvider: isSupabaseReady =', isSupabaseReady)
    
    if (!isSupabaseReady) {
      console.log('⚠️ AuthProvider: Supabase not ready, setting loading to false')
      setLoading(false)
      return
    }

    console.log('🔧 AuthProvider: Setting up Supabase auth listeners')
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔧 AuthProvider: Initial session:', session)
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
      console.log('🔧 AuthProvider: Auth state change:', event, session)
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
    console.log('🔧 fetchProfile: Starting for user:', userId)
    
    if (!isSupabaseReady) {
      console.log('⚠️ fetchProfile: Supabase not ready, setting loading to false')
      setLoading(false)
      return
    }

    try {
      console.log('🔧 fetchProfile: Fetching profile from database')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ fetchProfile: Error fetching profile:', error)
        // If profile doesn't exist, try to create it from user metadata
        if (error.code === 'PGRST116') {
          console.log('🔧 fetchProfile: Profile not found, creating from user metadata')
          await createProfileFromUser(userId)
        } else {
          // For other errors, create a default profile
          console.log('🔧 fetchProfile: Creating default profile for user')
          await createDefaultProfile(userId)
        }
      } else {
        console.log('✅ fetchProfile: Profile found:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('❌ fetchProfile: Error in fetchProfile:', error)
      // Create a fallback profile if everything fails
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        const fallbackProfile = {
          id: userId,
          email: userData.user.email || '',
          user_type: 'patient' as const,
          first_name: userData.user.email?.split('@')[0] || 'User',
          last_name: '',
          notification_preferences: {
            email: true,
            sms: true,
            in_app: true,
            pre_procedure: true,
            post_procedure: true,
            appointments: true,
            reminders: true,
            timing: 'morning'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        console.log('🔧 fetchProfile: Created fallback profile:', fallbackProfile)
        setProfile(fallbackProfile)
      }
    } finally {
      setLoading(false)
    }
  }

  const createProfileFromUser = async (userId: string) => {
    console.log('🔧 createProfileFromUser: Starting for user:', userId)
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        console.error('❌ createProfileFromUser: Error getting user data:', userError)
        return
      }

      const user = userData.user
      const metadata = user.user_metadata || {}
      console.log('🔧 createProfileFromUser: User metadata:', metadata)
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email || '',
          user_type: metadata.user_type || 'patient',
          first_name: metadata.first_name || '',
          last_name: metadata.last_name || '',
          clinic_id: metadata.clinic_id || null,
          notification_preferences: {
            email: true,
            sms: true,
            in_app: true,
            pre_procedure: true,
            post_procedure: true,
            appointments: true,
            reminders: true,
            timing: 'morning'
          }
        })
        .select()
        .single()

      if (error) {
        console.error('❌ createProfileFromUser: Error creating profile:', error)
      } else {
        console.log('✅ createProfileFromUser: Profile created successfully:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('❌ createProfileFromUser: Error creating profile from user:', error)
    }
  }

  const createDefaultProfile = async (userId: string) => {
    console.log('🔧 createDefaultProfile: Starting for user:', userId)
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        console.error('❌ createDefaultProfile: Error getting user data:', userError)
        return
      }

      const user = userData.user
      console.log('🔧 createDefaultProfile: Creating default profile for user:', user.email)
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email || '',
          user_type: 'patient', // Default to patient
          first_name: user.email?.split('@')[0] || 'User',
          last_name: '',
          notification_preferences: {
            email: true,
            sms: true,
            in_app: true,
            pre_procedure: true,
            post_procedure: true,
            appointments: true,
            reminders: true,
            timing: 'morning'
          }
        })
        .select()
        .single()

      if (error) {
        console.error('❌ createDefaultProfile: Error creating default profile:', error)
        // If we can't create a profile, create a mock one for the session
        const mockProfile = {
          id: userId,
          email: user.email || '',
          user_type: 'patient' as const,
          first_name: user.email?.split('@')[0] || 'User',
          last_name: '',
          notification_preferences: {
            email: true,
            sms: true,
            in_app: true,
            pre_procedure: true,
            post_procedure: true,
            appointments: true,
            reminders: true,
            timing: 'morning'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        console.log('🔧 createDefaultProfile: Created mock profile:', mockProfile)
        setProfile(mockProfile)
      } else {
        console.log('✅ createDefaultProfile: Profile created successfully:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('❌ createDefaultProfile: Error creating default profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('🔐 SIGNIN: Starting authentication for:', email)
    
    // Check for demo credentials first, but only for specific demo accounts
    const demoCredentials = {
      'patient@demo.com': { password: 'demo123', userType: 'patient', firstName: 'John', lastName: 'Doe' },
      'practitioner@demo.com': { password: 'demo123', userType: 'practitioner', firstName: 'Dr. Sarah', lastName: 'Johnson' },
      'admin@demo.com': { password: 'demo123', userType: 'admin', firstName: 'Admin', lastName: 'User' },
      'patient@example.com': { password: 'demo123', userType: 'patient', firstName: 'Demo', lastName: 'Patient' }
    }
    
    const credentials = demoCredentials[email as keyof typeof demoCredentials]
    
    // Always prioritize demo credentials - if it's a demo account, use demo auth regardless of Supabase
    if (credentials && credentials.password === password) {
      console.log('✅ SIGNIN: Demo authentication successful for:', email)
      // Create a mock user and profile
      const mockUser = {
        id: `demo-${credentials.userType}-1`,
        email,
        user_metadata: {
          user_type: credentials.userType,
          first_name: credentials.firstName,
          last_name: credentials.lastName
        }
      } as any
      
      const mockProfile = {
        id: mockUser.id,
        email,
        user_type: credentials.userType as 'patient' | 'practitioner' | 'admin',
        first_name: credentials.firstName,
        last_name: credentials.lastName,
        notification_preferences: {
          email: true,
          sms: true,
          in_app: true,
          pre_procedure: true,
          post_procedure: true,
          appointments: true,
          reminders: true,
          timing: 'morning'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setUser(mockUser)
      setProfile(mockProfile)
      setSession({ user: mockUser } as any)
      setLoading(false)
      
      console.log('✅ SIGNIN: Demo authentication successful')
      return { error: null }
    }
    
    // If not demo credentials and Supabase is configured, try real authentication
    if (isSupabaseReady) {
      console.log('🔐 SIGNIN: Attempting Supabase authentication for:', email)
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          console.log('❌ SIGNIN: Supabase authentication error:', error)
          // Provide more specific error messages
          if (error.message.includes('Invalid login credentials')) {
            return { error: { message: 'Invalid email or password. Please check your credentials.' } }
          } else if (error.message.includes('captcha')) {
            return { error: { message: 'Too many login attempts. Please wait a few minutes and try again, or reset your password.' } }
          } else if (error.message.includes('Email not confirmed')) {
            return { error: { message: 'Please check your email and click the confirmation link before logging in.' } }
          } else {
            return { error: { message: error.message || 'Authentication failed. Please try again.' } }
          }
        }
        
        if (data.user) {
          console.log('✅ SIGNIN: Supabase authentication successful, user:', data.user.email)
          // The auth state change listener will handle setting the user and profile
          return { error: null }
        }
        
        console.log('❌ SIGNIN: Supabase authentication failed - no user returned')
        return { error: { message: 'Authentication failed. Please try again.' } }
      } catch (error) {
        console.log('❌ SIGNIN: Supabase authentication exception:', error)
        return { error: { message: 'Network error. Please check your connection and try again.' } }
      }
    }
    
    // If neither demo nor Supabase works
    console.log('❌ SIGNIN: Authentication failed for:', email)
    return { error: { message: 'Invalid email or password. Demo accounts: patient@demo.com, practitioner@demo.com, admin@demo.com (password: demo123)' } }
  }

  const signUp = async (
    email: string, 
    password: string, 
    userType: string, 
    firstName: string, 
    lastName: string, 
    clinicId?: string
  ) => {
    console.log('🔐 SIGNUP: Starting registration process')
    console.log('🔐 SIGNUP: Email:', email)
    console.log('🔐 SIGNUP: UserType:', userType)
    console.log('🔐 SIGNUP: isSupabaseReady:', isSupabaseReady)
    
    if (!isSupabaseReady) {
      console.log('❌ SIGNUP: Supabase not configured')
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
      console.log('✅ SIGNUP: User created successfully:', data.user)
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
        console.error('❌ SIGNUP: Error creating profile manually:', profileError)
      } else {
        console.log('✅ SIGNUP: Profile created successfully')
      }
    } else {
      console.log('❌ SIGNUP: Registration failed:', error)
    }
  
    return { error }
  }

  const resetPassword = async (email: string) => {
    console.log('🔐 RESET: Starting password reset for:', email)
    
    if (!isSupabaseReady) {
      console.log('❌ RESET: Supabase not configured')
      return { error: { message: 'Supabase not configured. Please set up your environment variables.' } }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.log('❌ RESET: Password reset error:', error)
        return { error }
      }

      console.log('✅ RESET: Password reset email sent successfully')
      return { error: null }
    } catch (error) {
      console.log('❌ RESET: Password reset exception:', error)
      return { error: { message: 'Failed to send reset email. Please try again.' } }
    }
  }

  const signOut = async () => {
    console.log('🔐 SIGNOUT: Starting sign out process')
    if (isSupabaseReady) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setProfile(null)
    setSession(null)
    console.log('✅ SIGNOUT: Sign out completed')
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
    resetPassword,
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
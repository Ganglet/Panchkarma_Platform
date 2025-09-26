import { Appointment, Profile } from './supabase'

// Mock data for when Supabase is not configured
export const mockAppointments: Appointment[] = [
  // Demo Patient 1 (John Doe) appointments
  {
    id: '1',
    patient_id: 'demo-patient-1',
    practitioner_id: 'demo-practitioner-1',
    therapy: 'Abhyanga',
    appointment_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    duration: 60,
    status: 'scheduled',
    notes: 'First session - chronic back pain treatment',
    follow_up_required: true,
    follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'demo-practitioner-1',
      first_name: 'Dummy',
      last_name: 'Practitioner',
      email: 'practitioner@demo.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-1',
      first_name: 'Dummy',
      last_name: 'Patient',
      email: 'patient@demo.com',
      user_type: 'patient'
    }
  },
  {
    id: '2',
    patient_id: 'demo-patient-1',
    practitioner_id: 'demo-practitioner-1',
    therapy: 'Shirodhara',
    appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration: 45,
    status: 'confirmed',
    notes: 'Follow-up session - stress management',
    follow_up_required: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'demo-practitioner-1',
      first_name: 'Dummy',
      last_name: 'Practitioner',
      email: 'practitioner@demo.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-1',
      first_name: 'Dummy',
      last_name: 'Patient',
      email: 'patient@demo.com',
      user_type: 'patient'
    }
  },
  {
    id: '3',
    patient_id: 'demo-patient-1',
    practitioner_id: 'demo-practitioner-1',
    therapy: 'Basti',
    appointment_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    duration: 90,
    status: 'completed',
    notes: 'Completed successfully - digestive health improvement',
    practitioner_notes: 'Patient responded well to treatment, significant improvement in digestive issues',
    follow_up_required: true,
    follow_up_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'demo-practitioner-1',
      first_name: 'Dummy',
      last_name: 'Practitioner',
      email: 'practitioner@demo.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-1',
      first_name: 'Dummy',
      last_name: 'Patient',
      email: 'patient@demo.com',
      user_type: 'patient'
    }
  },
  {
    id: '4',
    patient_id: 'demo-patient-1',
    practitioner_id: 'demo-practitioner-1',
    therapy: 'Nasya',
    appointment_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    duration: 30,
    status: 'completed',
    notes: 'Nasal therapy for sinus issues',
    practitioner_notes: 'Good response, reduced nasal congestion',
    follow_up_required: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'demo-practitioner-1',
      first_name: 'Dummy',
      last_name: 'Practitioner',
      email: 'practitioner@demo.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-1',
      first_name: 'Dummy',
      last_name: 'Patient',
      email: 'patient@demo.com',
      user_type: 'patient'
    }
  },
  // Demo Practitioner's other patients
  {
    id: '5',
    patient_id: 'demo-patient-2',
    practitioner_id: 'demo-practitioner-1',
    therapy: 'Panchakarma',
    appointment_date: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    duration: 120,
    status: 'scheduled',
    notes: 'Complete Panchakarma detox program',
    follow_up_required: true,
    follow_up_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'demo-practitioner-1',
      first_name: 'Dummy',
      last_name: 'Practitioner',
      email: 'practitioner@demo.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-2',
      first_name: 'Emma',
      last_name: 'Wilson',
      email: 'emma.wilson@email.com',
      user_type: 'patient'
    }
  },
  {
    id: '6',
    patient_id: 'demo-patient-3',
    practitioner_id: 'demo-practitioner-1',
    therapy: 'Abhyanga',
    appointment_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    duration: 60,
    status: 'completed',
    notes: 'Therapeutic massage for muscle tension',
    practitioner_notes: 'Excellent session, patient reported significant relief',
    follow_up_required: true,
    follow_up_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'demo-practitioner-1',
      first_name: 'Dummy',
      last_name: 'Practitioner',
      email: 'practitioner@demo.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-3',
      first_name: 'Michael',
      last_name: 'Chen',
      email: 'michael.chen@email.com',
      user_type: 'patient'
    }
  },
  {
    id: '7',
    patient_id: 'demo-patient-4',
    practitioner_id: 'demo-practitioner-1',
    therapy: 'Shirodhara',
    appointment_date: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    duration: 45,
    status: 'confirmed',
    notes: 'Stress relief and mental clarity',
    follow_up_required: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'demo-practitioner-1',
      first_name: 'Dummy',
      last_name: 'Practitioner',
      email: 'practitioner@demo.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-4',
      first_name: 'Sarah',
      last_name: 'Davis',
      email: 'sarah.davis@email.com',
      user_type: 'patient'
    }
  }
]

export const mockPractitioners: Profile[] = [
  {
    id: 'demo-practitioner-1',
    email: 'practitioner@demo.com',
    user_type: 'practitioner',
    first_name: 'Dummy',
    last_name: 'Practitioner',
    specialization: 'Panchakarma Therapy',
    experience_years: 8,
    clinic_id: 'clinic-1',
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
  },
  {
    id: 'practitioner-2',
    email: 'michael.chen@clinic.com',
    user_type: 'practitioner',
    first_name: 'Dr. Michael',
    last_name: 'Chen',
    specialization: 'Ayurvedic Medicine',
    experience_years: 12,
    clinic_id: 'clinic-2',
    notification_preferences: {
      email: true,
      sms: false,
      in_app: true,
      pre_procedure: true,
      post_procedure: true,
      appointments: true,
      reminders: true,
      timing: 'evening'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const mockPatients: Profile[] = [
  {
    id: 'demo-patient-1',
    email: 'patient@demo.com',
    user_type: 'patient',
    first_name: 'Dummy',
    last_name: 'Patient',
    phone: '+1-555-0123',
    date_of_birth: '1985-06-15',
    gender: 'male',
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
  },
  {
    id: 'demo-patient-2',
    email: 'emma.wilson@email.com',
    user_type: 'patient',
    first_name: 'Emma',
    last_name: 'Wilson',
    phone: '+1-555-0234',
    date_of_birth: '1992-08-10',
    gender: 'female',
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
  },
  {
    id: 'demo-patient-3',
    email: 'michael.chen@email.com',
    user_type: 'patient',
    first_name: 'Michael',
    last_name: 'Chen',
    phone: '+1-555-0345',
    date_of_birth: '1988-12-03',
    gender: 'male',
    notification_preferences: {
      email: true,
      sms: false,
      in_app: true,
      pre_procedure: true,
      post_procedure: true,
      appointments: true,
      reminders: true,
      timing: 'afternoon'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-patient-4',
    email: 'sarah.davis@email.com',
    user_type: 'patient',
    first_name: 'Sarah',
    last_name: 'Davis',
    phone: '+1-555-0456',
    date_of_birth: '1995-04-18',
    gender: 'female',
    notification_preferences: {
      email: true,
      sms: true,
      in_app: true,
      pre_procedure: true,
      post_procedure: true,
      appointments: true,
      reminders: true,
      timing: 'evening'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Mock feedback data
export const mockFeedback = [
  {
    id: '1',
    patient_id: 'demo-patient-1',
    practitioner_id: 'demo-practitioner-1',
    appointment_id: '3',
    rating: 5,
    feedback_text: 'Excellent therapy session! Dr. Sarah was very professional and the treatment was very effective. My digestive issues have improved significantly.',
    symptoms_before: ['Bloating', 'Indigestion', 'Stomach pain'],
    symptoms_after: ['Reduced bloating', 'Better digestion'],
    overall_satisfaction: 5,
    would_recommend: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    patient_id: 'demo-patient-3',
    practitioner_id: 'demo-practitioner-1',
    appointment_id: '6',
    rating: 5,
    feedback_text: 'Amazing massage therapy! The Abhyanga treatment helped relieve my muscle tension completely. Highly recommend Dr. Sarah.',
    symptoms_before: ['Muscle tension', 'Back pain', 'Stress'],
    symptoms_after: ['Relaxed muscles', 'Reduced pain', 'Better sleep'],
    overall_satisfaction: 5,
    would_recommend: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    patient_id: 'demo-patient-1',
    practitioner_id: 'demo-practitioner-1',
    appointment_id: '4',
    rating: 4,
    feedback_text: 'Good nasal therapy session. Helped with my sinus congestion, though I still have some minor issues.',
    symptoms_before: ['Nasal congestion', 'Sinus pressure', 'Headaches'],
    symptoms_after: ['Reduced congestion', 'Less pressure'],
    overall_satisfaction: 4,
    would_recommend: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Mock therapy progress data
export const mockTherapyProgress = [
  {
    id: '1',
    patient_id: 'demo-patient-1',
    therapy: 'Abhyanga',
    total_sessions: 8,
    completed_sessions: 3,
    progress_percentage: 37.5,
    start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expected_completion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    current_status: 'in_progress'
  },
  {
    id: '2',
    patient_id: 'demo-patient-1',
    therapy: 'Basti',
    total_sessions: 6,
    completed_sessions: 1,
    progress_percentage: 16.7,
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expected_completion: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    current_status: 'in_progress'
  },
  {
    id: '3',
    patient_id: 'demo-patient-2',
    therapy: 'Panchakarma',
    total_sessions: 10,
    completed_sessions: 0,
    progress_percentage: 0,
    start_date: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    expected_completion: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    current_status: 'scheduled'
  }
]

export class MockDataService {
  static async getAppointments(userId: string, userType: 'patient' | 'practitioner'): Promise<Appointment[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (userType === 'patient') {
      return mockAppointments.filter(apt => apt.patient_id === userId)
    } else {
      return mockAppointments.filter(apt => apt.practitioner_id === userId)
    }
  }

  static async getUpcomingAppointments(userId: string, userType: 'patient' | 'practitioner', limit: number = 5): Promise<Appointment[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('MockDataService.getUpcomingAppointments called with:', { userId, userType, limit })
    console.log('Available mock appointments:', mockAppointments.length)
    console.log('First few appointments:', mockAppointments.slice(0, 3).map(apt => ({ 
      id: apt.id, 
      patient_id: apt.patient_id, 
      practitioner_id: apt.practitioner_id, 
      status: apt.status 
    })))
    
    // For demo accounts, always return some appointments regardless of date
    if (userId === 'demo-patient-1' || userId === 'demo-practitioner-1' || userId.startsWith('demo-') || userId.includes('demo')) {
      console.log('Processing demo account:', userId)
      const appointments = mockAppointments.filter(apt => {
        const isCorrectUser = userType === 'patient' ? apt.patient_id === userId : apt.practitioner_id === userId
        const isScheduled = ['scheduled', 'confirmed'].includes(apt.status)
        console.log('Appointment check:', { 
          aptId: apt.id, 
          aptPatientId: apt.patient_id, 
          aptPractitionerId: apt.practitioner_id,
          userId,
          userType,
          aptStatus: apt.status,
          isCorrectUser,
          isScheduled,
          willInclude: isCorrectUser && isScheduled
        })
        return isCorrectUser && isScheduled
      })
      
      console.log('Demo account - returning appointments:', appointments.length)
      console.log('Appointments:', appointments.map(apt => ({ id: apt.id, therapy: apt.therapy, status: apt.status })))
      return appointments.slice(0, limit)
    }
    
    const now = new Date()
    const appointments = mockAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date)
      const isUpcoming = aptDate > now
      const isCorrectUser = userType === 'patient' ? apt.patient_id === userId : apt.practitioner_id === userId
      const isScheduled = ['scheduled', 'confirmed'].includes(apt.status)
      
      return isUpcoming && isCorrectUser && isScheduled
    })
    
    console.log('Filtered appointments:', appointments.length)
    return appointments.slice(0, limit)
  }

  static async getPractitionerStats(practitionerId: string) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    console.log('MockDataService.getPractitionerStats called with practitionerId:', practitionerId)
    
    // For demo accounts, return realistic stats
    if (practitionerId === 'demo-practitioner-1' || practitionerId.startsWith('demo-') || practitionerId.includes('demo')) {
      const stats = {
        totalPatients: 15,
        totalAppointments: 45,
        completedAppointments: 38,
        todayAppointments: 2,
        weekAppointments: 8,
        completionRate: 85
      }
      console.log('Demo practitioner stats:', stats)
      return stats
    }
    
    const practitionerAppointments = mockAppointments.filter(apt => apt.practitioner_id === practitionerId)
    const uniquePatients = new Set(practitionerAppointments.map(apt => apt.patient_id))
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayAppointments = practitionerAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date)
      return aptDate >= today && aptDate < tomorrow
    })
    
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    
    const weekAppointments = practitionerAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date)
      return aptDate >= weekStart && aptDate < weekEnd
    })
    
    const completedAppointments = practitionerAppointments.filter(apt => apt.status === 'completed')
    
    return {
      totalPatients: uniquePatients.size,
      totalAppointments: practitionerAppointments.length,
      completedAppointments: completedAppointments.length,
      todayAppointments: todayAppointments.length,
      weekAppointments: weekAppointments.length,
      completionRate: practitionerAppointments.length > 0 
        ? Math.round((completedAppointments.length / practitionerAppointments.length) * 100) 
        : 0
    }
  }

  static async getPatientStats(patientId: string) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    console.log('MockDataService.getPatientStats called with patientId:', patientId)
    console.log('Available mock appointments:', mockAppointments.length)
    
    const patientAppointments = mockAppointments.filter(apt => apt.patient_id === patientId)
    console.log('Patient appointments found:', patientAppointments.length)
    
    // For demo accounts, return realistic stats
    if (patientId === 'demo-patient-1' || patientId.startsWith('demo-')) {
      const stats = {
        upcomingSessions: 3,
        totalSessions: 7,
        activeTherapies: 2,
        upcoming: 3,
        total: 7
      }
      console.log('Demo patient stats:', stats)
      console.log('Returning stats for demo patient:', patientId)
      return stats
    }
    
    const upcomingAppointments = patientAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date)
      const now = new Date()
      const isUpcoming = aptDate > now
      const isScheduled = ['scheduled', 'confirmed'].includes(apt.status)
      return isUpcoming && isScheduled
    })
    
    const activeTherapies = new Set(patientAppointments
      .filter(apt => apt.status !== 'completed' && apt.status !== 'cancelled')
      .map(apt => apt.therapy)
    )
    
    const stats = {
      upcomingSessions: upcomingAppointments.length,
      totalSessions: patientAppointments.length,
      activeTherapies: activeTherapies.size,
      upcoming: upcomingAppointments.length,
      total: patientAppointments.length
    }
    
    console.log('Patient stats calculated:', stats)
    return stats
  }

  static async getTherapyHistory(patientId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('MockDataService.getTherapyHistory called with patientId:', patientId)
    
    // For demo accounts, return some therapy history
    if (patientId === 'demo-patient-1' || patientId.startsWith('demo-')) {
      const history = [
        {
          therapy: 'Abhyanga',
          totalSessions: 3,
          completedSessions: 2
        },
        {
          therapy: 'Shirodhara',
          totalSessions: 2,
          completedSessions: 1
        },
        {
          therapy: 'Basti',
          totalSessions: 1,
          completedSessions: 1
        }
      ]
      console.log('Demo therapy history:', history.length, 'therapies')
      console.log('Returning therapy history for demo patient:', patientId)
      return history
    }
    
    const completedAppointments = mockAppointments.filter(apt => 
      apt.patient_id === patientId && apt.status === 'completed'
    )
    
    const therapyStats = completedAppointments.reduce((acc: any, appointment) => {
      const therapy = appointment.therapy
      if (!acc[therapy]) {
        acc[therapy] = { therapy, totalSessions: 0, completedSessions: 0 }
      }
      acc[therapy].totalSessions++
      acc[therapy].completedSessions++
      return acc
    }, {})
    
    return Object.values(therapyStats)
  }

  static async getPractitionerPatients(practitionerId: string) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const practitionerAppointments = mockAppointments.filter(apt => apt.practitioner_id === practitionerId)
    const uniquePatients = practitionerAppointments.reduce((acc: any[], appointment) => {
      const patientId = appointment.patient_id
      if (!acc.find(p => p.id === patientId)) {
        acc.push(appointment.patients)
      }
      return acc
    }, [])
    
    return uniquePatients
  }

  static async getFeedback(practitionerId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('MockDataService.getFeedback called with practitionerId:', practitionerId)
    
    // For demo accounts, return some feedback
    if (practitionerId === 'demo-practitioner-1' || practitionerId.startsWith('demo-')) {
      const feedback = [
        {
          id: '1',
          appointment_id: '3',
          patient_id: 'demo-patient-1',
          rating: 5,
          symptoms: ['Bloating', 'Indigestion', 'Stomach pain', 'Poor appetite'],
          improvements: ['Digestive health', 'Appetite', 'Energy levels', 'Sleep quality'],
          side_effects: ['Mild fatigue'],
          overall_feeling: 'Excellent therapy session! Dr. Dummy was very professional and the treatment was very effective. My digestive issues have improved significantly.',
          notes: 'The Basti therapy was very effective. I feel much better after just one session.',
          follow_up_needed: true,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '3',
            therapy: 'Basti',
            appointment_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-1',
              first_name: 'Dummy',
              last_name: 'Patient'
            }
          }
        },
        {
          id: '2',
          appointment_id: '4',
          patient_id: 'demo-patient-1',
          rating: 4,
          symptoms: ['Nasal congestion', 'Sinus pressure', 'Headaches', 'Difficulty breathing'],
          improvements: ['Nasal breathing', 'Sinus health', 'Headache frequency'],
          side_effects: ['Slight nasal irritation'],
          overall_feeling: 'Good nasal therapy session. Helped with my sinus congestion, though I still have some minor issues.',
          notes: 'The Nasya treatment was helpful. My breathing is much clearer now.',
          follow_up_needed: true,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '4',
            therapy: 'Nasya',
            appointment_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-1',
              first_name: 'Dummy',
              last_name: 'Patient'
            }
          }
        },
        {
          id: '3',
          appointment_id: '1',
          patient_id: 'demo-patient-1',
          rating: 5,
          symptoms: ['Chronic back pain', 'Stress', 'Muscle tension', 'Poor sleep'],
          improvements: ['Relaxation', 'Stress reduction', 'Pain relief', 'Better sleep'],
          side_effects: [],
          overall_feeling: 'Amazing massage therapy! The Abhyanga treatment helped relieve my muscle tension completely. Highly recommend Dr. Dummy.',
          notes: 'The therapeutic massage was very relaxing and effective for my back pain.',
          follow_up_needed: false,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '1',
            therapy: 'Abhyanga',
            appointment_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-1',
              first_name: 'Dummy',
              last_name: 'Patient'
            }
          }
        },
        {
          id: '4',
          appointment_id: '6',
          patient_id: 'demo-patient-3',
          rating: 5,
          symptoms: ['Muscle tension', 'Back pain', 'Stress', 'Poor posture'],
          improvements: ['Relaxed muscles', 'Reduced pain', 'Better sleep', 'Improved posture'],
          side_effects: [],
          overall_feeling: 'Excellent session! The practitioner was very skilled and the treatment was very effective for my muscle tension.',
          notes: 'The Abhyanga massage was perfect for my back pain. I feel much more relaxed.',
          follow_up_needed: true,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '6',
            therapy: 'Abhyanga',
            appointment_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-3',
              first_name: 'Michael',
              last_name: 'Chen'
            }
          }
        }
      ]
      console.log('Demo feedback:', feedback.length, 'entries')
      return feedback
    }
    
    return mockFeedback.filter(feedback => feedback.practitioner_id === practitionerId)
  }

  static async getTherapyProgress(patientId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('MockDataService.getTherapyProgress called with patientId:', patientId)
    
    // For demo accounts, return some therapy progress
    if (patientId === 'demo-patient-1' || patientId.startsWith('demo-')) {
      const progress = [
        {
          id: '1',
          patient_id: 'demo-patient-1',
          therapy_id: 'therapy-1',
          session_number: 3,
          appointment_id: '3',
          progress_notes: 'Patient showing significant improvement in digestive health. Reduced bloating and better appetite.',
          symptoms_before: ['Bloating', 'Indigestion', 'Stomach pain', 'Poor appetite'],
          symptoms_after: ['Reduced bloating', 'Better digestion', 'Improved appetite'],
          improvements: ['Digestive health', 'Appetite', 'Energy levels', 'Sleep quality'],
          practitioner_assessment: 'Excellent response to Basti therapy. Patient is following dietary recommendations well.',
          next_session_recommendations: 'Continue with current treatment plan. Consider adding Abhyanga for overall wellness.',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '3',
            therapy: 'Basti',
            appointment_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-1',
              first_name: 'Dummy',
              last_name: 'Patient'
            }
          },
          therapies: {
            id: 'therapy-1',
            name: 'Basti'
          }
        },
        {
          id: '2',
          patient_id: 'demo-patient-1',
          therapy_id: 'therapy-2',
          session_number: 2,
          appointment_id: '4',
          progress_notes: 'Good response to nasal therapy. Sinus congestion has reduced significantly.',
          symptoms_before: ['Nasal congestion', 'Sinus pressure', 'Headaches', 'Difficulty breathing'],
          symptoms_after: ['Reduced congestion', 'Less pressure', 'Clearer breathing'],
          improvements: ['Nasal breathing', 'Sinus health', 'Headache frequency'],
          practitioner_assessment: 'Patient responded well to Nasya therapy. Sinus issues are improving steadily.',
          next_session_recommendations: 'Continue with weekly sessions. Monitor for any recurrence of symptoms.',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '4',
            therapy: 'Nasya',
            appointment_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-1',
              first_name: 'Dummy',
              last_name: 'Patient'
            }
          },
          therapies: {
            id: 'therapy-2',
            name: 'Nasya'
          }
        },
        {
          id: '3',
          patient_id: 'demo-patient-1',
          therapy_id: 'therapy-3',
          session_number: 1,
          appointment_id: '1',
          progress_notes: 'Initial assessment completed. Patient has chronic back pain and stress-related issues.',
          symptoms_before: ['Chronic back pain', 'Stress', 'Muscle tension', 'Poor sleep'],
          symptoms_after: ['Slight pain relief', 'Feeling more relaxed'],
          improvements: ['Relaxation', 'Stress reduction'],
          practitioner_assessment: 'First session went well. Patient is open to treatment and follows instructions.',
          next_session_recommendations: 'Continue with Abhyanga therapy. Focus on lower back and stress relief.',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '1',
            therapy: 'Abhyanga',
            appointment_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-1',
              first_name: 'Dummy',
              last_name: 'Patient'
            }
          },
          therapies: {
            id: 'therapy-3',
            name: 'Abhyanga'
          }
        }
      ]
      console.log('Demo therapy progress:', progress.length, 'entries')
      return progress
    }
    
    return mockTherapyProgress.filter(progress => progress.patient_id === patientId)
  }

  static async getPatientFeedback(patientId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockFeedback.filter(feedback => feedback.patient_id === patientId)
  }

  static async getRecentFeedback(limit: number = 5) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockFeedback
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  }

  static async getTreatmentPlans(patientId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('MockDataService.getTreatmentPlans called with patientId:', patientId)
    
    // For demo accounts, return some treatment plans
    if (patientId === 'demo-patient-1' || patientId.startsWith('demo-')) {
      const plans = [
        {
          id: 'plan-1',
          patient_id: 'demo-patient-1',
          practitioner_id: 'demo-practitioner-1',
          name: 'Digestive Health Recovery',
          description: 'Comprehensive treatment plan for digestive issues including bloating, indigestion, and poor appetite.',
          total_sessions: 8,
          completed_sessions: 3,
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          expected_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          goals: ['Reduce bloating', 'Improve digestion', 'Increase appetite', 'Enhance energy levels'],
          current_phase: 'Mid-treatment',
          notes: 'Patient showing excellent progress. Continue with current protocol.',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'plan-2',
          patient_id: 'demo-patient-1',
          practitioner_id: 'demo-practitioner-1',
          name: 'Sinus Health Management',
          description: 'Targeted treatment for chronic sinus issues and nasal congestion.',
          total_sessions: 6,
          completed_sessions: 2,
          start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          expected_end_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          goals: ['Clear nasal passages', 'Reduce sinus pressure', 'Improve breathing', 'Prevent headaches'],
          current_phase: 'Early treatment',
          notes: 'Good response to Nasya therapy. Continue weekly sessions.',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      console.log('Demo treatment plans:', plans.length, 'plans')
      return plans
    }
    
    return []
  }

  static async getTreatmentPlansByPractitioner(practitionerId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('MockDataService.getTreatmentPlansByPractitioner called with practitionerId:', practitionerId)
    
    // For demo accounts, return some treatment plans
    if (practitionerId === 'demo-practitioner-1' || practitionerId.startsWith('demo-')) {
      const plans = [
        {
          id: 'plan-1',
          patient_id: 'demo-patient-1',
          practitioner_id: 'demo-practitioner-1',
          name: 'Digestive Health Recovery',
          description: 'Comprehensive treatment plan for digestive issues including bloating, indigestion, and poor appetite.',
          total_sessions: 8,
          completed_sessions: 3,
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          expected_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          goals: ['Reduce bloating', 'Improve digestion', 'Increase appetite', 'Enhance energy levels'],
          current_phase: 'Mid-treatment',
          notes: 'Patient showing excellent progress. Continue with current protocol.',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'plan-2',
          patient_id: 'demo-patient-1',
          practitioner_id: 'demo-practitioner-1',
          name: 'Sinus Health Management',
          description: 'Targeted treatment for chronic sinus issues and nasal congestion.',
          total_sessions: 6,
          completed_sessions: 2,
          start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          expected_end_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          goals: ['Clear nasal passages', 'Reduce sinus pressure', 'Improve breathing', 'Prevent headaches'],
          current_phase: 'Early treatment',
          notes: 'Good response to Nasya therapy. Continue weekly sessions.',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'plan-3',
          patient_id: 'demo-patient-2',
          practitioner_id: 'demo-practitioner-1',
          name: 'Complete Panchakarma Detox',
          description: 'Full Panchakarma detoxification program for overall health and wellness.',
          total_sessions: 10,
          completed_sessions: 0,
          start_date: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          expected_end_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled',
          goals: ['Complete detoxification', 'Improve overall health', 'Boost immunity', 'Enhance vitality'],
          current_phase: 'Pre-treatment',
          notes: 'Patient scheduled to begin comprehensive Panchakarma program.',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      console.log('Demo practitioner treatment plans:', plans.length, 'plans')
      return plans
    }
    
    return []
  }

  static async getFeedbackStats(practitionerId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('MockDataService.getFeedbackStats called with practitionerId:', practitionerId)
    
    // For demo accounts, return some feedback stats
    if (practitionerId === 'demo-practitioner-1' || practitionerId.startsWith('demo-')) {
      const stats = {
        totalFeedbacks: 4,
        averageRating: 4.75,
        ratingDistribution: {
          5: 3,
          4: 1,
          3: 0,
          2: 0,
          1: 0
        }
      }
      console.log('Demo feedback stats:', stats)
      return stats
    }
    
    return {
      totalFeedbacks: 0,
      averageRating: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    }
  }

  static async getTherapyProgressByPractitioner(practitionerId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('MockDataService.getTherapyProgressByPractitioner called with practitionerId:', practitionerId)
    
    // For demo accounts, return progress for all patients of this practitioner
    if (practitionerId === 'demo-practitioner-1' || practitionerId.startsWith('demo-')) {
      const progress = [
        {
          id: '1',
          patient_id: 'demo-patient-1',
          therapy_id: 'therapy-1',
          session_number: 3,
          appointment_id: '3',
          progress_notes: 'Patient showing significant improvement in digestive health. Reduced bloating and better appetite.',
          symptoms_before: ['Bloating', 'Indigestion', 'Stomach pain', 'Poor appetite'],
          symptoms_after: ['Reduced bloating', 'Better digestion', 'Improved appetite'],
          improvements: ['Digestive health', 'Appetite', 'Energy levels', 'Sleep quality'],
          practitioner_assessment: 'Excellent response to Basti therapy. Patient is following dietary recommendations well.',
          next_session_recommendations: 'Continue with current treatment plan. Consider adding Abhyanga for overall wellness.',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '3',
            therapy: 'Basti',
            appointment_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-1',
              first_name: 'Dummy',
              last_name: 'Patient'
            }
          },
          therapies: {
            id: 'therapy-1',
            name: 'Basti'
          }
        },
        {
          id: '2',
          patient_id: 'demo-patient-1',
          therapy_id: 'therapy-2',
          session_number: 2,
          appointment_id: '4',
          progress_notes: 'Good response to nasal therapy. Sinus congestion has reduced significantly.',
          symptoms_before: ['Nasal congestion', 'Sinus pressure', 'Headaches', 'Difficulty breathing'],
          symptoms_after: ['Reduced congestion', 'Less pressure', 'Clearer breathing'],
          improvements: ['Nasal breathing', 'Sinus health', 'Headache frequency'],
          practitioner_assessment: 'Patient responded well to Nasya therapy. Sinus issues are improving steadily.',
          next_session_recommendations: 'Continue with weekly sessions. Monitor for any recurrence of symptoms.',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '4',
            therapy: 'Nasya',
            appointment_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-1',
              first_name: 'Dummy',
              last_name: 'Patient'
            }
          },
          therapies: {
            id: 'therapy-2',
            name: 'Nasya'
          }
        },
        {
          id: '3',
          patient_id: 'demo-patient-3',
          therapy_id: 'therapy-3',
          session_number: 1,
          appointment_id: '6',
          progress_notes: 'Initial Abhyanga session completed successfully. Patient reported significant relief from muscle tension.',
          symptoms_before: ['Muscle tension', 'Back pain', 'Stress', 'Poor posture'],
          symptoms_after: ['Relaxed muscles', 'Reduced pain', 'Better sleep'],
          improvements: ['Muscle relaxation', 'Pain relief', 'Stress reduction', 'Better sleep'],
          practitioner_assessment: 'Excellent first session. Patient is very responsive to treatment and follows instructions well.',
          next_session_recommendations: 'Continue with weekly Abhyanga sessions. Focus on lower back and stress relief.',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          appointments: {
            id: '6',
            therapy: 'Abhyanga',
            appointment_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            patients: {
              id: 'demo-patient-3',
              first_name: 'Michael',
              last_name: 'Chen'
            }
          },
          therapies: {
            id: 'therapy-3',
            name: 'Abhyanga'
          }
        }
      ]
      console.log('Demo practitioner therapy progress:', progress.length, 'entries')
      return progress
    }
    
    return mockTherapyProgress.filter(progress => {
      // Find appointments for this practitioner and get their patient IDs
      const practitionerAppointments = mockAppointments.filter(apt => apt.practitioner_id === practitionerId)
      const practitionerPatientIds = new Set(practitionerAppointments.map(apt => apt.patient_id))
      return practitionerPatientIds.has(progress.patient_id)
    })
  }
}

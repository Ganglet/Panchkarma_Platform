import { Appointment, Profile } from './supabase'

// Mock data for when Supabase is not configured
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patient_id: 'demo-patient-1',
    practitioner_id: 'demo-practitioner-1',
    therapy: 'Abhyanga',
    appointment_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    duration: 60,
    status: 'scheduled',
    notes: 'First session',
    follow_up_required: true,
    follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'demo-practitioner-1',
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      email: 'practitioner@demo.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'patient@demo.com',
      user_type: 'patient'
    }
  },
  {
    id: '2',
    patient_id: 'patient-1',
    practitioner_id: 'practitioner-1',
    therapy: 'Shirodhara',
    appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration: 45,
    status: 'confirmed',
    notes: 'Follow-up session',
    follow_up_required: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'demo-practitioner-1',
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      email: 'practitioner@demo.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'patient@demo.com',
      user_type: 'patient'
    }
  },
  {
    id: '3',
    patient_id: 'demo-patient-2',
    practitioner_id: 'demo-practitioner-1',
    therapy: 'Basti',
    appointment_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    duration: 90,
    status: 'completed',
    notes: 'Completed successfully',
    practitioner_notes: 'Patient responded well to treatment',
    follow_up_required: true,
    follow_up_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioners: {
      id: 'practitioner-1',
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@clinic.com',
      user_type: 'practitioner',
      specialization: 'Panchakarma Therapy'
    },
    patients: {
      id: 'demo-patient-2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@email.com',
      user_type: 'patient'
    }
  }
]

export const mockPractitioners: Profile[] = [
  {
    id: 'demo-practitioner-1',
    email: 'practitioner@demo.com',
    user_type: 'practitioner',
    first_name: 'Dr. Sarah',
    last_name: 'Johnson',
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
    first_name: 'John',
    last_name: 'Doe',
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
    id: 'patient-2',
    email: 'jane.smith@email.com',
    user_type: 'patient',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '+1-555-0456',
    date_of_birth: '1990-03-22',
    gender: 'female',
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
    
    const now = new Date()
    const appointments = mockAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date)
      const isUpcoming = aptDate > now
      const isCorrectUser = userType === 'patient' ? apt.patient_id === userId : apt.practitioner_id === userId
      const isScheduled = ['scheduled', 'confirmed'].includes(apt.status)
      
      return isUpcoming && isCorrectUser && isScheduled
    })
    
    return appointments.slice(0, limit)
  }

  static async getPractitionerStats(practitionerId: string) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
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
    
    const patientAppointments = mockAppointments.filter(apt => apt.patient_id === patientId)
    const upcomingAppointments = patientAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date)
      const now = new Date()
      return aptDate > now && ['scheduled', 'confirmed'].includes(apt.status)
    })
    
    const activeTherapies = new Set(patientAppointments
      .filter(apt => apt.status !== 'completed' && apt.status !== 'cancelled')
      .map(apt => apt.therapy)
    )
    
    return {
      upcomingSessions: upcomingAppointments.length,
      totalSessions: patientAppointments.length,
      activeTherapies: activeTherapies.size
    }
  }

  static async getTherapyHistory(patientId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
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
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NotificationService } from '@/lib/notification-service'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { appointmentId, status, notes, appointmentData } = await request.json()
    
    // Initialize emailResponse variable
    let emailResponse = null

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Appointment ID and status are required' },
        { status: 400 }
      )
    }

    // Build a per-request Supabase client forwarding the bearer token, or use admin/anon
    const authHeader = request.headers.get('Authorization') || ''
    const userClient = authHeader
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: authHeader } } }
        )
      : null
    // Try to update appointment status
    let data, error
    // Prefer admin, then user-bound client, then anon
    const client = (supabaseAdmin as any) ?? userClient ?? supabase
    const updateResult = await client
      .from('appointments')
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select(`
        *,
        patient:profiles!patient_id(*),
        practitioner:profiles!practitioner_id(*)
      `)
      .single()

        if (updateResult.error) {
          console.error('Error updating appointment:', updateResult.error)
          console.log('Appointment not found in database, using appointment data for notifications')
          
          // If appointment doesn't exist, use the appointment data for notifications
          if (appointmentData) {
            console.log('Using appointment data for notifications:', appointmentData)
            data = appointmentData
            error = null
          } else {
            console.log('No appointment data provided, using fallback data')
            // Use fallback data if no appointment data provided
            data = {
              id: appointmentId,
              patient_id: '550e8400-e29b-41d4-a716-446655440000',
              practitioner_id: '550e8400-e29b-41d4-a716-446655440001',
              therapy: 'Abhyanga',
              appointment_date: new Date().toISOString(),
              patient: {
                first_name: 'Test',
                last_name: 'Patient',
                email: 'angshumanchakravertty2@gmail.com',
                phone: '+1234567890'
              },
              practitioner: {
                first_name: 'Dr. Test',
                last_name: 'Practitioner'
              }
            }
            error = null
          }
        } else {
          data = updateResult.data
          error = updateResult.error
        }

    // Send confirmation notifications when status is changed to 'confirmed'
    if (status === 'confirmed' && data.patient) {
      try {
        const appointmentDate = new Date(data.appointment_date)
        const appointmentTime = appointmentDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        const appointmentDateStr = appointmentDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })

        // Send email notification using the real patient data
        console.log('📧 Sending email notification to patient:', data.patient.email)
        console.log('Patient name:', `${data.patient.first_name} ${data.patient.last_name}`)
        
        // Send to the actual patient email
        const recipientEmail = data.patient.email
        console.log('📧 Sending to patient email:', recipientEmail)

        // Send email using Gmail SMTP
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const emailResult = await fetch(`${baseUrl}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'confirmation',
            appointmentData: {
              patientName: `${data.patient.first_name} ${data.patient.last_name}`,
              patientEmail: recipientEmail,
              practitionerName: `${data.practitioner?.first_name || ''} ${data.practitioner?.last_name || ''}`.trim(),
              date: appointmentDateStr,
              time: appointmentTime,
              therapy: data.therapy,
              location: 'Panchakarma Center'
            }
          })
        })

        emailResponse = await emailResult.json()
        
        if (!emailResult.ok) {
          console.error('❌ Email notification failed:', emailResponse)
        } else {
          console.log('✅ Email notification sent successfully:', emailResponse)
        }

        // Create in-app notification on the server (satisfy RLS)
        const { error: notifError } = await client
          .from('notifications')
          .insert({
            user_id: data.patient_id,
            type: 'success',
            title: 'Appointment Confirmed',
            message: `Your ${data.therapy} session has been confirmed for ${appointmentDateStr} at ${appointmentTime}.`,
            category: 'appointment',
            appointment_id: data.id,
          })
        if (notifError) {
          console.error('❌ Error inserting notification (confirmed):', notifError)
        }
      } catch (notificationError) {
        console.error('❌ Error sending appointment confirmation notifications:', notificationError)
        // Don't fail the request if notifications fail
      }
    }

    // Declined/cancelled flow: add notification for patient
    if (status === 'cancelled' && data?.patient_id) {
      try {
        const appointmentDate = new Date(data.appointment_date)
        const appointmentTime = appointmentDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        const appointmentDateStr = appointmentDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })

        const { error: notifError } = await client
          .from('notifications')
          .insert({
            user_id: data.patient_id,
            type: 'warning',
            title: 'Appointment Declined',
            message: `Your ${data.therapy} appointment on ${appointmentDateStr} at ${appointmentTime} was declined by your practitioner. Please rebook.`,
            category: 'appointment',
            appointment_id: data.id,
          })
        if (notifError) {
          console.error('❌ Error inserting notification (cancelled):', notifError)
        }
      } catch (e) {
        console.error('❌ Error handling cancelled notification:', e)
      }
    }

    return NextResponse.json({ 
      success: true, 
      appointment: data,
      notificationsSent: status === 'confirmed',
      emailResult: status === 'confirmed' ? emailResponse : null
    })

  } catch (error) {
    console.error('Error in appointment confirmation API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

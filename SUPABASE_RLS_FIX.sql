-- Copy and paste this SQL into your Supabase SQL Editor to fix RLS policies
-- Go to: https://supabase.com/dashboard/project/ucvkuprpouknqqybfjxv/sql

-- Fix RLS policies for appointments table
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Patients can manage their own appointments" ON appointments;
DROP POLICY IF EXISTS "Practitioners can manage their appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can manage all appointments" ON appointments;

-- Policy for patients and practitioners: can read, create, update appointments they're involved in
CREATE POLICY "Users can manage their appointments" ON appointments
    FOR ALL USING (
        patient_id = auth.uid() OR 
        practitioner_id = auth.uid()
    );

-- Fix notifications table RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON notifications;

-- Policy for users to manage their own notifications
CREATE POLICY "Users can manage their notifications" ON notifications
    FOR ALL USING (user_id = auth.uid());

-- Fix RLS policies for appointments table
-- This allows users to create, read, update appointments they're involved in

-- Enable RLS on appointments table
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Patients can manage their own appointments" ON appointments;
DROP POLICY IF EXISTS "Practitioners can manage their appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can manage all appointments" ON appointments;

-- Policy for patients: can read, create, update appointments where they are the patient
CREATE POLICY "Patients can manage their own appointments" ON appointments
    FOR ALL USING (
        patient_id = auth.uid() OR 
        practitioner_id = auth.uid()
    );

-- Also fix notifications table RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON notifications;

CREATE POLICY "Users can manage their own notifications" ON notifications
    FOR ALL USING (user_id = auth.uid());

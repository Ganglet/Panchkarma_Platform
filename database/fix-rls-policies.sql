-- Fix RLS policies for appointments table
-- This allows users to create, read, update appointments they're involved in

-- Enable RLS on appointments table
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy for patients: can read, create, update appointments where they are the patient
CREATE POLICY "Patients can manage their own appointments" ON appointments
    FOR ALL USING (
        patient_id = auth.uid() OR 
        practitioner_id = auth.uid()
    );

-- Policy for practitioners: can read, create, update appointments where they are the practitioner
CREATE POLICY "Practitioners can manage their appointments" ON appointments
    FOR ALL USING (
        practitioner_id = auth.uid() OR 
        patient_id = auth.uid()
    );

-- Policy for admins: can do everything
CREATE POLICY "Admins can manage all appointments" ON appointments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- Also fix notifications table RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications" ON notifications
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );
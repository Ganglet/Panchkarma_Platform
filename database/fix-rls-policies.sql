-- Fix RLS policies to allow user registration
-- Add missing INSERT policy for profiles table

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Also add INSERT policies for other tables that might be needed during registration
CREATE POLICY "Users can insert own notifications" ON notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own therapy progress" ON therapy_progress
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can insert own treatment plans" ON treatment_plans
    FOR INSERT WITH CHECK (auth.uid() = patient_id OR auth.uid() = practitioner_id);

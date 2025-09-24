-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_type AS ENUM ('patient', 'practitioner', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE notification_type AS ENUM ('reminder', 'alert', 'info', 'success', 'warning');
CREATE TYPE notification_category AS ENUM ('pre_procedure', 'post_procedure', 'appointment', 'general', 'therapy_update');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    user_type user_type NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    clinic_id UUID,
    specialization TEXT, -- For practitioners
    license_number TEXT, -- For practitioners
    experience_years INTEGER, -- For practitioners
    bio TEXT,
    avatar_url TEXT,
    notification_preferences JSONB DEFAULT '{
        "email": true,
        "sms": true,
        "in_app": true,
        "pre_procedure": true,
        "post_procedure": true,
        "appointments": true,
        "reminders": true,
        "timing": "2"
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinics table
CREATE TABLE clinics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    description TEXT,
    services JSONB DEFAULT '[]',
    operating_hours JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Therapies table
CREATE TABLE therapies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    category TEXT,
    pre_procedure_instructions TEXT,
    post_procedure_instructions TEXT,
    contraindications TEXT,
    benefits TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    practitioner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    therapy_id UUID REFERENCES therapies(id) ON DELETE SET NULL,
    therapy TEXT NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL,
    status appointment_status DEFAULT 'scheduled',
    notes TEXT,
    practitioner_notes TEXT,
    patient_notes TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category notification_category,
    therapy_id UUID REFERENCES therapies(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    read BOOLEAN DEFAULT FALSE,
    sent_email BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    symptoms JSONB DEFAULT '[]',
    improvements JSONB DEFAULT '[]',
    side_effects JSONB DEFAULT '[]',
    overall_feeling TEXT,
    notes TEXT,
    follow_up_needed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Therapy progress table
CREATE TABLE therapy_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    therapy_id UUID REFERENCES therapies(id) ON DELETE CASCADE NOT NULL,
    session_number INTEGER NOT NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    progress_notes TEXT,
    symptoms_before JSONB DEFAULT '[]',
    symptoms_after JSONB DEFAULT '[]',
    improvements JSONB DEFAULT '[]',
    practitioner_assessment TEXT,
    next_session_recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatment plans table
CREATE TABLE treatment_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    practitioner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    total_sessions INTEGER NOT NULL,
    completed_sessions INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    expected_end_date DATE,
    actual_end_date DATE,
    status TEXT DEFAULT 'active',
    goals JSONB DEFAULT '[]',
    current_phase TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wellness metrics table
CREATE TABLE wellness_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL,
    metric_unit TEXT,
    notes TEXT,
    recorded_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_clinic_id ON profiles(clinic_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_practitioner_id ON appointments(practitioner_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_feedback_patient_id ON feedback(patient_id);
CREATE INDEX idx_feedback_appointment_id ON feedback(appointment_id);
CREATE INDEX idx_therapy_progress_patient_id ON therapy_progress(patient_id);
CREATE INDEX idx_treatment_plans_patient_id ON treatment_plans(patient_id);
CREATE INDEX idx_wellness_metrics_patient_id ON wellness_metrics(patient_id);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Appointments policies
CREATE POLICY "Users can view own appointments" ON appointments
    FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can create appointments" ON appointments
    FOR INSERT WITH CHECK (auth.uid() = practitioner_id);

CREATE POLICY "Users can update own appointments" ON appointments
    FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can view own feedback" ON feedback
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create feedback" ON feedback
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Therapy progress policies
CREATE POLICY "Users can view own therapy progress" ON therapy_progress
    FOR SELECT USING (auth.uid() = patient_id);

-- Treatment plans policies
CREATE POLICY "Users can view own treatment plans" ON treatment_plans
    FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);

-- Wellness metrics policies
CREATE POLICY "Users can view own wellness metrics" ON wellness_metrics
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can insert own wellness metrics" ON wellness_metrics
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapy_progress_updated_at BEFORE UPDATE ON therapy_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at BEFORE UPDATE ON treatment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO clinics (name, address, phone, email, description) VALUES
('Ayur Wellness Center', '123 Wellness Street, Mumbai, India', '+91-9876543210', 'info@ayurwellness.com', 'Traditional Ayurvedic treatments with modern facilities'),
('Traditional Healing Clinic', '456 Heritage Road, Delhi, India', '+91-9876543211', 'contact@traditionalhealing.com', 'Authentic Panchakarma treatments'),
('Panchakarma Specialty Center', '789 Health Avenue, Bangalore, India', '+91-9876543212', 'admin@panchakarmacenter.com', 'Specialized Panchakarma detoxification programs');

INSERT INTO therapies (name, description, duration_minutes, category, pre_procedure_instructions, post_procedure_instructions) VALUES
('Abhyanga', 'Full body oil massage with medicated oils', 60, 'Massage', 'Avoid heavy meals 2 hours before. Drink plenty of water.', 'Rest for 30 minutes. Avoid cold water for 2 hours.'),
('Shirodhara', 'Continuous flow of warm oil on forehead', 45, 'Relaxation', 'Light meal 1 hour before. Empty bladder.', 'Rest for 1 hour. Avoid screens for 2 hours.'),
('Basti', 'Medicated enema therapy', 90, 'Detoxification', 'Light diet day before. Empty bowels in morning.', 'Rest for 2 hours. Follow prescribed diet.'),
('Panchakarma Consultation', 'Comprehensive assessment and treatment planning', 30, 'Consultation', 'Bring medical history. Fast for 2 hours before.', 'Follow treatment plan. Schedule next appointment.'),
('Nasya', 'Nasal administration of medicated oils', 20, 'Respiratory', 'Empty stomach. Clean nasal passages.', 'Avoid cold foods. Rest for 30 minutes.'),
('Virechana', 'Therapeutic purgation', 120, 'Detoxification', 'Light diet for 3 days. Stay hydrated.', 'Rest for 24 hours. Follow prescribed diet for 1 week.');

-- Part 4: Additional Tables and Indexes
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

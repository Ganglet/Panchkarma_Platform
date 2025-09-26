-- Part 5: Security Policies and Sample Data
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


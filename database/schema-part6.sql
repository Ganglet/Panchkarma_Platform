-- Part 6: Functions, Triggers, and Sample Data
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

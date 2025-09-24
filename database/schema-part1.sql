-- Part 1: Extensions and Types
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_type AS ENUM ('patient', 'practitioner', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE notification_type AS ENUM ('reminder', 'alert', 'info', 'success', 'warning');
CREATE TYPE notification_category AS ENUM ('pre_procedure', 'post_procedure', 'appointment', 'general', 'therapy_update');

-- Part 2: Core Tables
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
    specialization TEXT,
    license_number TEXT,
    experience_years INTEGER,
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


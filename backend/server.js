const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token verification failed' });
  }
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return res.status(400).json({ error: 'Profile not found' });
    }

    res.json({
      user: data.user,
      session: data.session,
      profile
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, userType, firstName, lastName, clinicId } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        user_type: userType,
        first_name: firstName,
        last_name: lastName,
        clinic_id: clinicId || null,
        created_at: new Date().toISOString()
      });

    if (profileError) {
      return res.status(400).json({ error: 'Failed to create profile' });
    }

    res.json({
      user: data.user,
      session: data.session
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/logout', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Appointments routes
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        practitioners:profiles!appointments_practitioner_id_fkey(*),
        patients:profiles!appointments_patient_id_fkey(*)
      `)
      .or(`patient_id.eq.${req.user.id},practitioner_id.eq.${req.user.id}`)
      .order('appointment_date', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { patientId, therapy, appointmentDate, duration, notes } = req.body;

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        practitioner_id: req.user.id,
        therapy,
        appointment_date: appointmentDate,
        duration,
        notes,
        status: 'scheduled',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Notifications routes
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { userId, type, title, message, category, therapyId } = req.body;

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        category,
        therapy_id: therapyId,
        read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feedback routes
app.get('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        appointments:appointments(*)
      `)
      .eq('patient_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const { appointmentId, rating, symptoms, improvements, sideEffects, overallFeeling, notes } = req.body;

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        appointment_id: appointmentId,
        patient_id: req.user.id,
        rating,
        symptoms,
        improvements,
        side_effects: sideEffects,
        overall_feeling: overallFeeling,
        notes,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});


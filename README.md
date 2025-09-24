# Panchakarma Management Platform

A comprehensive healthcare management system for Panchakarma therapy, integrating traditional Ayurveda with modern digital efficiency.

## 🚀 Features

### Core Functionality
- **Automated Therapy Scheduling**: Plan and manage therapy sessions automatically
- **Notification System**: Automated alerts for pre- and post-procedure precautions
- **Real-Time Therapy Tracking**: View therapy progress, upcoming sessions, and recovery milestones
- **Visualization Tools**: Graphs and progress bars to track improvements
- **Integrated Feedback Loop**: Report symptoms, side effects, and improvements after each session

### User Roles
- **Patients**: Access personal dashboard, book appointments, track progress, provide feedback
- **Practitioners**: Manage patients, schedule appointments, view analytics, track therapy outcomes
- **Secure Authentication**: JWT-based authentication with Supabase Auth

### Technical Features
- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Animations**: Smooth transitions with Framer Motion
- **Real-time Updates**: Live notifications and progress tracking
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Backend**: Node.js/Express API with Supabase integration

## 🛠️ Tech Stack

### Frontend
- **TypeScript** - Type-safe development
- **React.js** - Modern UI framework
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives

### Backend
- **Node.js & Express** - Server runtime and framework
- **Supabase Auth** - JWT-based authentication
- **PostgreSQL** - Database with Supabase
- **Row-Level Security** - Database security

### Security & Privacy
- **Authentication**: Supabase Auth (JWT-based, secure)
- **Database Access**: Supabase Row-Level Security (RLS)
- **Data Encryption**: At rest (DB) + in transit (SSL/TLS)
- **API Security**: Secure backend endpoints with authentication middleware

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd panchakarma-platform
```

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the database schema:
   ```bash
   # In Supabase SQL Editor, run the contents of database/schema.sql
   ```

### 4. Environment Configuration

Create environment files:

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** (`.env`):
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## 📁 Project Structure

```
panchakarma-platform/
├── app/                    # Next.js app directory
│   ├── patient/           # Patient-specific pages
│   ├── practitioner/      # Practitioner-specific pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── feedback/         # Feedback system
│   ├── notifications/    # Notification system
│   ├── progress/         # Progress tracking
│   ├── scheduling/       # Appointment scheduling
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
├── backend/              # Express.js backend
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── database/             # Database schema and migrations
└── public/               # Static assets
```

## 🔐 Authentication

The platform uses Supabase Auth for secure authentication:

- **JWT-based tokens** for session management
- **Row-Level Security** for database access control
- **Protected routes** based on user roles
- **Automatic session refresh** and persistence

### User Types
- **Patient**: Access to personal dashboard, appointments, progress tracking
- **Practitioner**: Access to patient management, scheduling, analytics
- **Admin**: Full system access (future implementation)

## 📊 Database Schema

The database includes the following main tables:
- `profiles` - User profiles and information
- `appointments` - Therapy appointments and scheduling
- `notifications` - System notifications and alerts
- `feedback` - Patient feedback and session reviews
- `therapy_progress` - Progress tracking and milestones
- `treatment_plans` - Comprehensive treatment planning
- `wellness_metrics` - Health metrics and measurements

## 🔔 Notification System

The platform includes a comprehensive notification system:

- **Pre-procedure reminders** with preparation instructions
- **Post-procedure care** instructions
- **Appointment confirmations** and reminders
- **Customizable channels**: Email, SMS, in-app
- **Timing preferences**: 30 minutes to 24 hours before appointments

## 📈 Progress Tracking

Real-time therapy progress tracking includes:

- **Visual progress charts** and metrics
- **Milestone tracking** and achievements
- **Symptom monitoring** and improvement tracking
- **Wellness metrics** and health indicators
- **Treatment plan adherence** monitoring

## 🎨 UI/UX Features

- **Modern design** with clean, intuitive interface
- **Smooth animations** using Framer Motion
- **Responsive layout** for all device sizes
- **Accessible components** with Radix UI
- **Dark/light theme** support (future implementation)

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Connect your repository to your hosting platform
2. Set environment variables
3. Deploy the backend directory

### Database (Supabase)
- Production database is automatically managed by Supabase
- Ensure RLS policies are properly configured
- Set up proper backup and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔮 Future Enhancements

- **Mobile App**: React Native implementation
- **AI Integration**: Smart therapy recommendations
- **Video Consultations**: Telemedicine capabilities
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Internationalization
- **Payment Integration**: Billing and payment processing

---

**Built with ❤️ for the Panchakarma community**

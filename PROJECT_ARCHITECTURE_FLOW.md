# Panchakarma Platform - Technical Architecture & Flow Diagram

## 🏗️ **SYSTEM OVERVIEW**

The Panchakarma Platform is a comprehensive healthcare management system built with modern web technologies, designed to manage Panchakarma therapy treatments, appointments, and patient care.

---

## 🛠️ **TECHNICAL STACK**

### **Frontend Technologies:**
- **Framework:** Next.js 14 (React-based)
- **Styling:** Tailwind CSS + Shadcn/UI components
- **Animations:** Framer Motion
- **State Management:** React Context API
- **Authentication:** Supabase Auth

### **Backend Technologies:**
- **API Server:** Express.js (Node.js)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime
- **File Storage:** Supabase Storage

### **Infrastructure:**
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel (Frontend) + Railway/Heroku (Backend)
- **CDN:** Vercel Edge Network

---

## 🔄 **SYSTEM ARCHITECTURE FLOW**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PANCHAKARMA PLATFORM                             │
│                         Complete System Architecture                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USER ACCESS   │    │  AUTHENTICATION │    │  AUTHORIZATION  │
│                 │    │                 │    │                 │
│ • Patient       │───▶│ • Supabase Auth │───▶│ • JWT Tokens    │
│ • Practitioner  │    │ • Email/Password│    │ • Role-based    │
│ • Admin         │    │ • Session Mgmt  │    │ • RLS Policies  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER (Next.js)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  📱 User Interface Components                                               │
│  ├── Patient Dashboard     ├── Practitioner Dashboard  ├── Admin Panel      │
│  ├── Appointment Calendar  ├── Therapy Progress        ├── Analytics        │
│  ├── Feedback System       ├── Notification Center     ├── Settings         │
│  └── Navigation           └── Authentication Forms    └── Reports           │
│                                                                             │
│  🎨 UI/UX Layer                                                             │
│  ├── Tailwind CSS         ├── Shadcn/UI Components    ├── Framer Motion     │
│  └── Responsive Design    └── Dark/Light Themes       └── Animations        │
│                                                                             │
│  🔧 State Management                                                        │
│  ├── AuthContext         ├── React Hooks             ├── Local State        │
│  └── Global State        └── Component State         └── Form State         │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER (Business Logic)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  📋 Core Services                                                           │
│  ├── AppointmentService   ├── NotificationService     ├── FeedbackService   │
│  ├── TherapyService       ├── PractitionerService     ├── ProgressService   │
│  └── UserService          └── AnalyticsService        └── ReportService     │
│                                                                             │
│  🔄 Service Operations                                                      │
│  ├── CRUD Operations      ├── Data Validation         ├── Error Handling    │
│  ├── Business Rules       ├── Data Transformation     ├── Caching           │
│  └── API Integration      └── Real-time Updates       └── Background Jobs   │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER (Express.js)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  🚪 API Endpoints                                                           │
│  ├── /auth/*              ├── /api/appointments/*     ├── /api/feedback/*   │
│  ├── /api/notifications/* ├── /api/therapies/*       ├── /api/progress/*    │
│  └── /api/users/*         └── /api/analytics/*       └── /api/reports/*     │
│                                                                             │
│  🔒 Security Layer                                                          │
│  ├── JWT Authentication   ├── Rate Limiting           ├── CORS Policy       │
│  ├── Input Validation     ├── SQL Injection Protection├── XSS Protection    │
│  └── Role-based Access    └── API Key Management     └── Audit Logging      │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER (Supabase/PostgreSQL)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  🗄️ Core Tables                                                             │
│  ├── profiles            ├── appointments            ├── notifications      │
│  ├── clinics             ├── therapies               ├── feedback           │
│  ├── therapy_progress    ├── treatment_plans         ├── wellness_metrics   │
│  └── auth.users          └── audit_logs             └── system_settings     │
│                                                                             │
│  🔐 Security & Performance                                                  │
│  ├── Row Level Security  ├── Database Indexes        ├── Triggers           │
│  ├── Foreign Keys        ├── Stored Procedures       ├── Views              │
│  └── Backup & Recovery   └── Performance Monitoring  └── Data Encryption    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **DETAILED DATA FLOW PROCESSES**

### **1. USER AUTHENTICATION FLOW**

```
User Login Request
        │
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Login Form    │───▶│  Auth Context   │───▶│ Supabase Auth   │
│                 │    │                 │    │                 │
│ • Email         │    │ • signIn()      │    │ • JWT Token     │
│ • Password      │    │ • signUp()      │    │ • Session Mgmt  │
│ • User Type     │    │ • signOut()     │    │ • Profile Data  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Profile Creation│    │ State Update    │    │ Database Query  │
│                 │    │                 │    │                 │
│ • Auto-create   │    │ • User State    │    │ • profiles table│
│ • Metadata      │    │ • Profile State │    │ • RLS Policies  │
│ • User Type     │    │ • Session State │    │ • Permissions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │
        ▼
┌─────────────────┐
│ Dashboard Route │
│                 │
│ • Patient → /patient/dashboard
│ • Practitioner → /practitioner/dashboard
│ • Admin → /admin/dashboard
└─────────────────┘
```

### **2. APPOINTMENT BOOKING FLOW**

```
Appointment Booking Request
        │
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Booking Modal   │───▶│ AppointmentService│───▶│ Database Insert │
│                 │    │                 │    │                 │
│ • Patient ID    │    │ • Validation    │    │ • appointments  │
│ • Therapy Type  │    │ • Business Logic│    │ • Foreign Keys  │
│ • Date/Time     │    │ • Error Handling│    │ • Constraints   │
│ • Duration      │    │ • Notifications │    │ • Triggers      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ UI Update       │    │ Notification    │    │ Real-time Sync  │
│                 │    │ Scheduling      │    │                 │
│ • Calendar      │    │ • Pre-procedure │    │ • Supabase RT   │
│ • Dashboard     │    │ • Reminders     │    │ • Live Updates  │
│ • Confirmation  │    │ • Alerts        │    │ • State Sync    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **3. THERAPY PROGRESS TRACKING FLOW**

```
Progress Update Request
        │
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Progress Form   │───▶│ ProgressService │───▶│ Database Update │
│                 │    │                 │    │                 │
│ • Session Notes │    │ • Data Validation│    │ • therapy_progress│
│ • Symptoms      │    │ • Calculations  │    │ • treatment_plans│
│ • Improvements  │    │ • Analytics     │    │ • wellness_metrics│
│ • Side Effects  │    │ • Notifications │    │ • Audit Trail   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Dashboard Update│    │ Alert Generation│    │ Report Updates  │
│                 │    │                 │    │                 │
│ • Progress Bars │    │ • Practitioner  │    │ • Analytics     │
│ • Charts        │    │ • Patient       │    │ • Trends        │
│ • Milestones    │    │ • Admin         │    │ • Insights      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **4. NOTIFICATION SYSTEM FLOW**

```
Event Trigger
        │
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ System Event    │───▶│ NotificationService│───▶│ Notification    │
│                 │    │                 │    │ Creation        │
│ • Appointment   │    │ • Event Handler │    │                 │
│ • Progress      │    │ • Template      │    │ • notifications │
│ • Feedback      │    │ • Scheduling    │    │ • Categories    │
│ • Alerts        │    │ • Priority      │    │ • Timing        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Multi-channel   │    │ User Preferences│    │ Delivery Status │
│ Delivery        │    │                 │    │                 │
│ • In-app        │    │ • Email         │    │ • Sent          │
│ • Email         │    │ • SMS           │    │ • Delivered     │
│ • SMS           │    │ • Push          │    │ • Read          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔗 **COMPONENT INTERACTIONS**

### **Frontend Component Hierarchy:**

```
App (Root)
├── AuthProvider (Context)
├── Layout
│   ├── Navigation
│   │   ├── Logo
│   │   ├── NavItems
│   │   ├── Notifications
│   │   └── Profile Dropdown
│   └── Main Content
│       ├── Patient Dashboard
│       │   ├── Stats Cards
│       │   ├── Upcoming Appointments
│       │   ├── Therapy Progress
│       │   └── Quick Actions
│       ├── Practitioner Dashboard
│       │   ├── Analytics Cards
│       │   ├── Today's Schedule
│       │   ├── Patient Management
│       │   └── Therapy Planner
│       ├── Appointment Calendar
│       ├── Feedback System
│       ├── Progress Tracking
│       └── Notification Center
└── Global Components
    ├── Toaster (Notifications)
    ├── Modals
    ├── Forms
    └── Loading States
```

### **Service Layer Dependencies:**

```
Service Layer
├── AppointmentService
│   ├── NotificationService (for reminders)
│   ├── FeedbackService (for post-appointment)
│   └── ProgressService (for tracking)
├── NotificationService
│   ├── User preferences
│   ├── Email/SMS providers
│   └── Scheduling system
├── FeedbackService
│   ├── AppointmentService (for context)
│   ├── AnalyticsService (for insights)
│   └── NotificationService (for follow-up)
├── TherapyService
│   ├── Treatment planning
│   ├── Progress tracking
│   └── Recommendation engine
└── PractitionerService
    ├── Patient management
    ├── Analytics dashboard
    └── Performance metrics
```

---

## 🗄️ **DATABASE RELATIONSHIPS**

### **Core Entity Relationships:**

```
profiles (Users)
├── One-to-Many → appointments (as patient)
├── One-to-Many → appointments (as practitioner)
├── One-to-Many → notifications
├── One-to-Many → feedback
├── One-to-Many → therapy_progress
├── One-to-Many → treatment_plans
├── One-to-Many → wellness_metrics
└── Many-to-One → clinics

appointments
├── Many-to-One → profiles (patient)
├── Many-to-One → profiles (practitioner)
├── Many-to-One → therapies
├── One-to-One → feedback
└── One-to-Many → notifications

therapies
├── One-to-Many → appointments
├── One-to-Many → therapy_progress
└── One-to-Many → notifications

clinics
├── One-to-Many → profiles (practitioners)
└── Service definitions
```

---

## 🔄 **REAL-TIME FEATURES**

### **Supabase Realtime Subscriptions:**

```
Real-time Updates
├── Appointment Changes
│   ├── Status updates
│   ├── Schedule changes
│   └── Cancellations
├── Notification Delivery
│   ├── New notifications
│   ├── Read status
│   └── Priority alerts
├── Progress Updates
│   ├── Therapy progress
│   ├── Milestone achievements
│   └── Health metrics
└── System Events
    ├── Practitioner availability
    ├── Clinic updates
    └── Maintenance alerts
```

---

## 🚀 **DEPLOYMENT ARCHITECTURE**

### **Production Environment:**

```
Internet
    │
    ▼
┌─────────────────┐
│   Vercel CDN    │
│                 │
│ • Global Edge   │
│ • SSL/TLS       │
│ • DDoS Protection│
│ • Caching       │
└─────────────────┘
    │
    ▼
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │
│   (Next.js)     │◄──►│   (Express.js)  │
│                 │    │                 │
│ • Static Files  │    │ • REST APIs     │
│ • Server-Side   │    │ • Authentication│
│ • Client-Side   │    │ • Business Logic│
└─────────────────┘    └─────────────────┘
    │                           │
    ▼                           ▼
┌─────────────────────────────────────────┐
│           Supabase Platform             │
│                                         │
│ • PostgreSQL Database                   │
│ • Authentication Service                │
│ • Real-time Subscriptions               │
│ • File Storage                          │
│ • Edge Functions                        │
│ • Row Level Security                    │
└─────────────────────────────────────────┘
```

---

## 📊 **MONITORING & ANALYTICS**

### **System Monitoring:**

```
Monitoring Stack
├── Application Monitoring
│   ├── Error Tracking (Sentry)
│   ├── Performance Metrics
│   └── User Analytics
├── Database Monitoring
│   ├── Query Performance
│   ├── Connection Pooling
│   └── Backup Status
├── Infrastructure Monitoring
│   ├── Server Health
│   ├── Response Times
│   └── Resource Usage
└── Business Analytics
    ├── User Engagement
    ├── Therapy Success Rates
    ├── Appointment Patterns
    └── Revenue Tracking
```

---

## 🔐 **SECURITY IMPLEMENTATION**

### **Security Layers:**

```
Security Architecture
├── Authentication Layer
│   ├── JWT Tokens
│   ├── Session Management
│   └── Multi-factor Auth (Future)
├── Authorization Layer
│   ├── Role-based Access
│   ├── Row Level Security
│   └── API Permissions
├── Data Protection
│   ├── Encryption at Rest
│   ├── Encryption in Transit
│   └── PII Handling
├── Application Security
│   ├── Input Validation
│   ├── SQL Injection Prevention
│   ├── XSS Protection
│   └── CSRF Protection
└── Infrastructure Security
    ├── HTTPS/TLS
    ├── Firewall Rules
    ├── DDoS Protection
    └── Regular Security Audits
```

---

## 🎯 **KEY FEATURES & CAPABILITIES**

### **Patient Features:**
- ✅ User registration and authentication
- ✅ Appointment booking and management
- ✅ Therapy progress tracking
- ✅ Feedback and rating system
- ✅ Notification center
- ✅ Health metrics tracking
- ✅ Treatment plan visibility

### **Practitioner Features:**
- ✅ Patient management dashboard
- ✅ Appointment scheduling
- ✅ Therapy planning and customization
- ✅ Progress monitoring and analytics
- ✅ Feedback review and analysis
- ✅ Automated notification system
- ✅ Performance metrics and reporting

### **System Features:**
- ✅ Real-time updates and synchronization
- ✅ Multi-clinic support
- ✅ Role-based access control
- ✅ Automated notification system
- ✅ Data analytics and reporting
- ✅ Mobile-responsive design
- ✅ Secure data handling

---

## 📈 **SCALABILITY & PERFORMANCE**

### **Performance Optimizations:**

```
Performance Strategy
├── Frontend Optimizations
│   ├── Code Splitting
│   ├── Lazy Loading
│   ├── Image Optimization
│   └── Caching Strategies
├── Backend Optimizations
│   ├── Database Indexing
│   ├── Query Optimization
│   ├── Connection Pooling
│   └── API Rate Limiting
├── Infrastructure Optimizations
│   ├── CDN Distribution
│   ├── Edge Computing
│   ├── Load Balancing
│   └── Auto-scaling
└── Monitoring & Alerting
    ├── Performance Metrics
    ├── Error Tracking
    ├── Resource Monitoring
    └── Automated Alerts
```

---

This comprehensive architecture diagram shows how your Panchakarma Platform is structured as a modern, scalable, and secure healthcare management system. The system follows best practices for web application development and provides a solid foundation for managing Panchakarma therapy treatments efficiently.

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Clock, TrendingUp, Settings, Bell, FileText, BarChart3, Zap, AlertTriangle, CheckCircle, Activity, Target, MessageSquare, Sparkles, Star, Loader2 } from "lucide-react"
import { AppointmentCalendar } from "@/components/scheduling/appointment-calendar"
import { PatientManagement } from "@/components/practitioner/patient-management"
import { TherapyPlanner } from "@/components/practitioner/therapy-planner"
import { AnalyticsDashboard } from "@/components/practitioner/analytics-dashboard"
import { ProcedureAlerts } from "@/components/notifications/procedure-alerts"
import { TherapyProgress } from "@/components/progress/therapy-progress"
import { FeedbackSystem } from "@/components/feedback/feedback-system"
import { useAuth } from "@/contexts/auth-context"
import { PractitionerService } from "@/lib/practitioner-service"
import { AppointmentService, Appointment } from "@/lib/appointment-service"
import { MockDataService } from "@/lib/mock-data-service"
import { isSupabaseReady } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function PractitionerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState({
    todayPatients: 0,
    weekPatients: 0,
    totalPatients: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      loadDashboardData()
    }
  }, [profile])

  const loadDashboardData = async () => {
    if (!profile) return
    
    setLoading(true)
    try {
      let statsData, todayData
      
      console.log('Loading practitioner dashboard data for profile:', profile)
      console.log('isSupabaseReady:', isSupabaseReady)
      console.log('Profile ID:', profile.id)
      console.log('Profile type:', profile.user_type)
      
      // Always use mock data for demo accounts
      if (profile.id === 'demo-practitioner-1' || profile.id.startsWith('demo-') || !isSupabaseReady) {
        const practitionerId = profile.id
        console.log('Using mock data for practitioner ID:', practitionerId)
        
        const [statsResult, todayResult] = await Promise.all([
          MockDataService.getPractitionerStats(practitionerId),
          MockDataService.getUpcomingAppointments(practitionerId, 'practitioner', 5)
        ])
        statsData = statsResult
        todayData = todayResult
      } else {
        // Use real Supabase data
        [statsData, todayData] = await Promise.all([
          PractitionerService.getPractitionerStats(profile.id),
          loadTodayAppointments()
        ])
      }
      
      console.log('Loaded practitioner data:', { statsData, todayData })
      
      const finalStats = {
        todayPatients: statsData?.todayAppointments || 0,
        weekPatients: statsData?.weekAppointments || 0,
        totalPatients: statsData?.totalPatients || 0,
        completionRate: statsData?.completionRate || 0
      }
      
      console.log('Setting final practitioner stats:', finalStats)
      console.log('Setting today appointments:', todayData?.length || 0)
      
      setStats(finalStats)
      setTodayAppointments(todayData || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTodayAppointments = async () => {
    if (!profile) return []
    
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const data = await AppointmentService.getAppointments(profile.id, 'practitioner')
      const todayAppts = data?.filter(apt => {
        const aptDate = new Date(apt.appointment_date)
        return aptDate >= today && aptDate < tomorrow
      }) || []
      
      setTodayAppointments(todayAppts)
      return todayAppts
    } catch (error) {
      console.error('Error loading today appointments:', error)
      return []
    }
  }

  const automatedFeatures = [
    {
      title: "Automated Scheduling",
      description: "AI-powered therapy scheduling based on patient needs and availability",
      status: "active",
      icon: Zap,
      color: "text-green-600"
    },
    {
      title: "Pre-Procedure Alerts",
      description: "Automated notifications for patient preparation",
      status: "active", 
      icon: Bell,
      color: "text-blue-600"
    },
    {
      title: "Post-Procedure Care",
      description: "Follow-up reminders and care instructions",
      status: "active",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Progress Tracking",
      description: "Real-time therapy progress monitoring",
      status: "active",
      icon: Activity,
      color: "text-purple-600"
    }
  ]

  const therapyProgress = [
    { patient: "Sarah Johnson", therapy: "Abhyanga", progress: 75, sessions: 6, total: 8 },
    { patient: "Michael Chen", therapy: "Shirodhara", progress: 50, sessions: 3, total: 6 },
    { patient: "Emma Wilson", therapy: "Panchakarma", progress: 90, sessions: 9, total: 10 },
  ]

  const recentFeedback = [
    { patient: "Sarah Johnson", rating: 5, feedback: "Excellent therapy session, feeling much better", date: "2 hours ago" },
    { patient: "Michael Chen", rating: 4, feedback: "Good progress, minor side effects noted", date: "4 hours ago" },
    { patient: "Emma Wilson", rating: 5, feedback: "Amazing results, highly recommend", date: "1 day ago" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-emerald-50/30">
      {/* Header */}
      <motion.header 
        className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold gradient-text-secondary">Practitioner Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Dr. <span className="font-semibold text-secondary">{profile?.first_name} {profile?.last_name}</span> - 
                <span className="text-primary font-medium">
                  {profile?.clinic_id === 'ayur-wellness' ? ' Ayur Wellness Center' :
                   profile?.clinic_id === 'traditional-healing' ? ' Traditional Healing Clinic' :
                   profile?.clinic_id === 'panchakarma-center' ? ' Panchakarma Specialty Center' :
                   ' Panchakarma Center'}
                </span>
              </p>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={signOut} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "schedule", label: "Schedule", icon: Calendar },
              { id: "patients", label: "Patients", icon: Users },
              { id: "therapy", label: "Therapy Planner", icon: FileText },
              { id: "progress", label: "Progress", icon: Activity },
              { id: "feedback", label: "Feedback", icon: MessageSquare },
              { id: "alerts", label: "Alerts", icon: Bell },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 border-b-2 transition-all duration-300 rounded-t-xl relative group whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-secondary text-secondary bg-secondary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className={`h-4 w-4 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium text-sm">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent rounded-t-xl"
                    layoutId="activeTabPractitioner"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
              key="overview"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Today's Patients", value: stats.todayPatients, icon: Users, color: "text-primary" },
                  { label: "This Week", value: stats.weekPatients, icon: Calendar, color: "text-secondary" },
                  { label: "Total Patients", value: stats.totalPatients, icon: Users, color: "text-accent" },
                  { label: "Success Rate", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-primary" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-glow-blue transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                            whileHover={{ rotate: 5 }}
                          >
                            <stat.icon className="h-6 w-6 text-white" />
                          </motion.div>
                          <div>
                            <p className="text-3xl font-bold gradient-text-secondary">
                              {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stat.value}
                            </p>
                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Automated Features Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="h-5 w-5 text-primary" />
                      </motion.div>
                      Automated Features Status
                    </CardTitle>
                    <CardDescription>AI-powered Panchakarma management tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {automatedFeatures.map((feature, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center gap-3 p-4 border border-border/50 rounded-xl hover:border-primary/30 transition-all duration-300 group"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <motion.div 
                            className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300"
                            whileHover={{ rotate: 5 }}
                          >
                            <feature.icon className={`h-5 w-5 ${feature.color}`} />
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{feature.title}</h4>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                            <Badge variant="outline" className="mt-2 text-xs bg-green-50 text-green-700 border-green-200">
                              {feature.status}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>Your appointments for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="ml-2">Loading today's schedule...</span>
                        </div>
                      ) : todayAppointments.length > 0 ? (
                        todayAppointments.map((appointment) => {
                          const aptTime = new Date(appointment.appointment_date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })
                          const patientName = appointment.patients ? 
                            `${appointment.patients.first_name} ${appointment.patients.last_name}` : 
                            'Unknown Patient'
                          
                          return (
                            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{patientName}</h4>
                                  <p className="text-sm text-muted-foreground">{appointment.therapy}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {aptTime} • {appointment.duration} min
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    appointment.status === "confirmed"
                                      ? "default"
                                      : appointment.status === "in_progress"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {appointment.status.replace('_', ' ')}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No appointments scheduled for today</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="h-20 flex-col gap-2">
                        <Calendar className="h-6 w-6" />
                        Schedule Appointment
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <Users className="h-6 w-6" />
                        Add Patient
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <Bell className="h-6 w-6" />
                        Send Alerts
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <Activity className="h-6 w-6" />
                        Track Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

            {activeTab === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <AppointmentCalendar userType="practitioner" />
              </motion.div>
            )}
            
            {activeTab === "patients" && (
              <motion.div
                key="patients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <PatientManagement />
              </motion.div>
            )}
            
            {activeTab === "therapy" && (
              <motion.div
                key="therapy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <TherapyPlanner />
              </motion.div>
            )}
            
            {activeTab === "progress" && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <TherapyProgress />
              </motion.div>
            )}

            {activeTab === "feedback" && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <FeedbackSystem />
              </motion.div>
            )}

            {activeTab === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ProcedureAlerts />
              </motion.div>
            )}
            
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <AnalyticsDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    )
  }

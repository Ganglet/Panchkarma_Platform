"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Bell, Activity, BookOpen, LogOut, Sparkles, TrendingUp, Clock, CheckCircle, Loader2 } from "lucide-react"
import { AppointmentCalendar } from "@/components/scheduling/appointment-calendar"
import { TherapyProgress } from "@/components/progress/therapy-progress"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { useAuth } from "@/contexts/auth-context"
import { AppointmentService, Appointment } from "@/lib/appointment-service"
import { MockDataService } from "@/lib/mock-data-service"
import { isSupabaseReady } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [therapyHistory, setTherapyHistory] = useState<any[]>([])
  const [stats, setStats] = useState({
    upcomingSessions: 0,
    totalSessions: 0,
    activeTherapies: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Patient dashboard useEffect triggered, profile:', profile)
    if (profile) {
      console.log('Profile exists, loading dashboard data')
      console.log('Profile details:', {
        id: profile.id,
        email: profile.email,
        user_type: profile.user_type,
        first_name: profile.first_name,
        last_name: profile.last_name
      })
      loadDashboardData()
    } else {
      console.log('No profile found')
    }
  }, [profile])

  const loadDashboardData = async () => {
    if (!profile) return
    
    setLoading(true)
    try {
      let upcomingData, historyData, statsData
      
      console.log('Loading dashboard data for profile:', profile)
      console.log('isSupabaseReady:', isSupabaseReady)
      console.log('Profile ID:', profile.id)
      console.log('Profile type:', profile.user_type)
      
      // Use the actual profile ID for mock data
      const patientId = profile.id
      console.log('Using mock data for patient ID:', patientId)
      console.log('Profile ID:', profile.id, 'Profile email:', profile.email)
      
      [upcomingData, historyData, statsData] = await Promise.all([
        MockDataService.getUpcomingAppointments(patientId, 'patient', 5),
        MockDataService.getTherapyHistory(patientId),
        MockDataService.getPatientStats(patientId)
      ])
      
      console.log('Loaded data:', { upcomingData, historyData, statsData })
      console.log('upcomingData type:', typeof upcomingData, 'length:', upcomingData?.length)
      console.log('historyData type:', typeof historyData, 'length:', historyData?.length)
      console.log('statsData type:', typeof statsData, 'content:', statsData)
      
      const finalStats = {
        upcomingSessions: statsData?.upcomingSessions || statsData?.upcoming || 0,
        totalSessions: statsData?.totalSessions || statsData?.total || 0,
        activeTherapies: statsData?.activeTherapies || historyData?.length || 0
      }
      
      console.log('Setting final stats:', finalStats)
      console.log('Setting upcoming appointments:', upcomingData?.length || 0)
      console.log('Setting therapy history:', historyData?.length || 0)
      
      setUpcomingAppointments(upcomingData || [])
      setTherapyHistory(historyData || [])
      setStats(finalStats)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30">
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
              <h1 className="text-3xl font-bold gradient-text">Patient Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Welcome back, <span className="font-semibold text-primary">{profile?.first_name} {profile?.last_name}</span>
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
                Notifications
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/profile')}>
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
          <div className="flex space-x-2">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "progress", label: "Progress", icon: BookOpen },
              { id: "notifications", label: "Notifications", icon: Bell },
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-6 border-b-2 transition-all duration-300 rounded-t-xl relative group ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className={`h-4 w-4 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-t-xl"
                    layoutId="activeTab"
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
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card className="group hover:shadow-glow transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                            whileHover={{ rotate: 5 }}
                          >
                            <Calendar className="h-6 w-6 text-white" />
                          </motion.div>
                          <div>
                            <p className="text-3xl font-bold gradient-text">{loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.upcomingSessions}</p>
                            <p className="text-sm text-muted-foreground font-medium">Upcoming Sessions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="group hover:shadow-glow-blue transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                            whileHover={{ rotate: 5 }}
                          >
                            <TrendingUp className="h-6 w-6 text-white" />
                          </motion.div>
                          <div>
                            <p className="text-3xl font-bold gradient-text-secondary">{loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalSessions}</p>
                            <p className="text-sm text-muted-foreground font-medium">Total Sessions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                            whileHover={{ rotate: 5 }}
                          >
                            <CheckCircle className="h-6 w-6 text-white" />
                          </motion.div>
                          <div>
                            <p className="text-3xl font-bold text-purple-600">{loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.activeTherapies}</p>
                            <p className="text-sm text-muted-foreground font-medium">Active Therapies</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
              </div>

                {/* Upcoming Appointments */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Upcoming Appointments
                      </CardTitle>
                      <CardDescription>Your scheduled therapy sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="ml-2">Loading appointments...</span>
                          </div>
                        ) : upcomingAppointments.length > 0 ? (
                          upcomingAppointments.map((appointment, index) => {
                            const aptDate = new Date(appointment.appointment_date)
                            const dateStr = aptDate.toLocaleDateString()
                            const timeStr = aptDate.toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            })
                            const practitionerName = appointment.practitioners ? 
                              `Dr. ${appointment.practitioners.first_name} ${appointment.practitioners.last_name}` : 
                              'Unknown Practitioner'
                            
                            return (
                              <motion.div 
                                key={appointment.id} 
                                className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/30 transition-all duration-300 group"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex items-center gap-4">
                                  <motion.div 
                                    className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300"
                                    whileHover={{ rotate: 5 }}
                                  >
                                    <User className="h-5 w-5 text-primary" />
                                  </motion.div>
                                  <div>
                                    <h4 className="font-semibold text-lg">{appointment.therapy}</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {dateStr} at {timeStr}
                                    </p>
                                    <p className="text-sm text-muted-foreground">with {practitionerName}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={appointment.status === "confirmed" ? "default" : "secondary"}
                                    className="px-3 py-1"
                                  >
                                    {appointment.status.replace('_', ' ')}
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    Reschedule
                                  </Button>
                                </div>
                              </motion.div>
                            )
                          })
                        ) : (
                          <p className="text-muted-foreground text-center py-8">No upcoming appointments</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
            </div>

              {/* Therapy Progress */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Therapy Progress
                      </CardTitle>
                      <CardDescription>Your current treatment progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="ml-2">Loading therapy history...</span>
                          </div>
                        ) : therapyHistory.length > 0 ? (
                          therapyHistory.map((therapy, index) => (
                            <motion.div 
                              key={index} 
                              className="space-y-3"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-base">{therapy.therapy}</span>
                                <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                                  {therapy.completedSessions}/{therapy.totalSessions}
                                </span>
                              </div>
                              <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                                <motion.div
                                  className="bg-gradient-to-r from-primary to-emerald-400 h-3 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(therapy.completedSessions / therapy.totalSessions) * 100}%` }}
                                  transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                />
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">No therapy history available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full" variant="default" size="lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book New Appointment
                      </Button>
                      <Button variant="outline" size="lg" className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Treatment Plan
                      </Button>
                      <Button variant="outline" size="lg" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Contact Practitioner
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <AppointmentCalendar userType="patient" />
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
          
          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <NotificationCenter />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

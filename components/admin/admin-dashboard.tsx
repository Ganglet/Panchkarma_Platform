"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Bell, 
  FileText, 
  BarChart3, 
  Shield, 
  Activity, 
  Target, 
  MessageSquare, 
  Sparkles, 
  Star, 
  Loader2,
  UserCheck,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { motion, AnimatePresence } from "framer-motion"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { profile, signOut } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPractitioners: 0,
    totalPatients: 0,
    totalAppointments: 0,
    activeTherapies: 0,
    systemHealth: 100
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Simulate loading admin data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalUsers: 156,
        totalPractitioners: 12,
        totalPatients: 144,
        totalAppointments: 89,
        activeTherapies: 67,
        systemHealth: 98
      })
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const systemAlerts = [
    { id: 1, type: 'info', message: 'System backup completed successfully', time: '2 hours ago' },
    { id: 2, type: 'warning', message: 'High server load detected', time: '4 hours ago' },
    { id: 3, type: 'success', message: 'New practitioner registered', time: '6 hours ago' }
  ]

  const recentActivities = [
    { id: 1, action: 'New patient registration', user: 'John Doe', time: '10 minutes ago' },
    { id: 2, action: 'Appointment scheduled', user: 'Dr. Smith', time: '25 minutes ago' },
    { id: 3, action: 'Therapy completed', user: 'Jane Wilson', time: '1 hour ago' },
    { id: 4, action: 'Feedback submitted', user: 'Mike Johnson', time: '2 hours ago' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <motion.header
        className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-xl gradient-text">Admin Panel</span>
                <p className="text-xs text-muted-foreground">System Management</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-right">
                <p className="text-sm font-medium">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-xs text-muted-foreground">System Administrator</p>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <span className="mr-2">Logout</span>
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
              { id: "users", label: "Users", icon: Users },
              { id: "practitioners", label: "Practitioners", icon: UserCheck },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "system", label: "System", icon: Settings },
              { id: "alerts", label: "Alerts", icon: Bell },
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 border-b-2 transition-all duration-300 rounded-t-xl relative group whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-500 bg-red-500/5"
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
                    className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-t-xl"
                    layoutId="activeTabAdmin"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Practitioners</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPractitioners}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+3</span> this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Patients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPatients}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+18</span> this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-blue-600">Today</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Therapies</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeTherapies}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+5</span> this week
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Health</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.systemHealth}%</div>
                    <p className="text-xs text-muted-foreground">
                      All systems operational
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* System Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    System Alerts
                  </CardTitle>
                  <CardDescription>Recent system notifications and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          alert.type === 'success' ? 'bg-green-500' :
                          alert.type === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>Latest system activities and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage all system users and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">User management interface coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "system" && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system-wide settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">System settings interface coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}


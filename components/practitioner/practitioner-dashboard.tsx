"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Clock, TrendingUp, Settings, Bell, FileText, BarChart3, Zap, AlertTriangle, CheckCircle, Activity, Target, MessageSquare } from "lucide-react"
import { AppointmentCalendar } from "@/components/scheduling/appointment-calendar"
import { PatientManagement } from "@/components/practitioner/patient-management"
import { TherapyPlanner } from "@/components/practitioner/therapy-planner"
import { AnalyticsDashboard } from "@/components/practitioner/analytics-dashboard"
import { ProcedureAlerts } from "@/components/notifications/procedure-alerts"
import { TherapyProgress } from "@/components/progress/therapy-progress"
import { FeedbackSystem } from "@/components/feedback/feedback-system"
import { useAuth } from "@/contexts/auth-context"

export function PractitionerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { profile } = useAuth()

  const todayAppointments = [
    {
      id: 1,
      patient: "Sarah Johnson",
      therapy: "Abhyanga",
      time: "10:00 AM",
      duration: "60 min",
      status: "confirmed",
    },
    {
      id: 2,
      patient: "Michael Chen",
      therapy: "Shirodhara",
      time: "2:00 PM",
      duration: "90 min",
      status: "in-progress",
    },
    {
      id: 3,
      patient: "Emma Wilson",
      therapy: "Panchakarma Consultation",
      time: "4:00 PM",
      duration: "45 min",
      status: "upcoming",
    },
  ]

  const stats = [
    { label: "Today's Patients", value: "8", icon: Users, color: "text-primary" },
    { label: "This Week", value: "42", icon: Calendar, color: "text-secondary" },
    { label: "Avg Session Time", value: "75min", icon: Clock, color: "text-accent" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-primary" },
  ]

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Practitioner Dashboard</h1>
              <p className="text-muted-foreground">
                Dr. {profile?.first_name} {profile?.last_name} - 
                {profile?.clinic_id === 'ayur-wellness' ? ' Ayur Wellness Center' :
                 profile?.clinic_id === 'traditional-healing' ? ' Traditional Healing Clinic' :
                 profile?.clinic_id === 'panchakarma-center' ? ' Panchakarma Specialty Center' :
                 ' Panchakarma Center'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "schedule", label: "Schedule", icon: Calendar },
              { id: "patients", label: "Patients", icon: Users },
              { id: "therapy", label: "Therapy Planner", icon: FileText },
              { id: "progress", label: "Progress Tracking", icon: Activity },
              { id: "feedback", label: "Patient Feedback", icon: MessageSquare },
              { id: "alerts", label: "Procedure Alerts", icon: Bell },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Automated Features Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Automated Features Status
                </CardTitle>
                <CardDescription>AI-powered Panchakarma management tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {automatedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your appointments for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{appointment.patient}</h4>
                            <p className="text-sm text-muted-foreground">{appointment.therapy}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.time} • {appointment.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              appointment.status === "confirmed"
                                ? "default"
                                : appointment.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {appointment.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
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
                    <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                      <Users className="h-6 w-6" />
                      Add Patient
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                      <Bell className="h-6 w-6" />
                      Send Alerts
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                      <Activity className="h-6 w-6" />
                      Track Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "schedule" && <AppointmentCalendar userType="practitioner" />}
        {activeTab === "patients" && <PatientManagement />}
        {activeTab === "therapy" && <TherapyPlanner />}
        
        {activeTab === "progress" && <TherapyProgress />}

        {activeTab === "feedback" && <FeedbackSystem />}

        {activeTab === "alerts" && <ProcedureAlerts />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Bell, Activity, BookOpen, LogOut } from "lucide-react"
import { AppointmentCalendar } from "@/components/scheduling/appointment-calendar"
import { TherapyProgress } from "@/components/progress/therapy-progress"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

export function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { profile, signOut } = useAuth()

  const upcomingAppointments = [
    {
      id: 1,
      therapy: "Abhyanga",
      date: "2024-01-15",
      time: "10:00 AM",
      practitioner: "Dr. Priya Sharma",
      status: "confirmed",
    },
    {
      id: 2,
      therapy: "Shirodhara",
      date: "2024-01-17",
      time: "2:00 PM",
      practitioner: "Dr. Raj Patel",
      status: "pending",
    },
  ]

  const therapyHistory = [
    { therapy: "Abhyanga", sessions: 8, completed: 6 },
    { therapy: "Shirodhara", sessions: 5, completed: 3 },
    { therapy: "Panchakarma Detox", sessions: 21, completed: 12 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Patient Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.first_name} {profile?.last_name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
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
              { id: "overview", label: "Overview", icon: Activity },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "progress", label: "Progress", icon: BookOpen },
              { id: "notifications", label: "Notifications", icon: Bell },
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Activity className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">21</p>
                        <p className="text-sm text-muted-foreground">Total Sessions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <BookOpen className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">Active Therapies</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled therapy sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{appointment.therapy}</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-sm text-muted-foreground">with {appointment.practitioner}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                            {appointment.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Therapy Progress */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Therapy Progress</CardTitle>
                  <CardDescription>Your current treatment progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {therapyHistory.map((therapy, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{therapy.therapy}</span>
                          <span className="text-muted-foreground">
                            {therapy.completed}/{therapy.sessions}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${(therapy.completed / therapy.sessions) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="default">
                    Book New Appointment
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Treatment Plan
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Contact Practitioner
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "appointments" && <AppointmentCalendar userType="patient" />}
        {activeTab === "progress" && <TherapyProgress />}
        {activeTab === "notifications" && <NotificationCenter />}
      </main>
    </div>
  )
}

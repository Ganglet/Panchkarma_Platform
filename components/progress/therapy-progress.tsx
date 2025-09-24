"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Calendar, Target, Award, Activity, BarChart3 } from "lucide-react"
import { ProgressChart } from "./progress-chart"
import { MilestoneTracker } from "./milestone-tracker"
import { WellnessMetrics } from "./wellness-metrics"

interface TherapySession {
  id: string
  date: string
  therapy: string
  duration: number
  practitioner: string
  notes: string
  rating: number
  symptoms: string[]
  improvements: string[]
}

interface TherapyPlan {
  id: string
  name: string
  totalSessions: number
  completedSessions: number
  startDate: string
  expectedEndDate: string
  status: "active" | "completed" | "paused"
  goals: string[]
  currentPhase: string
}

export function TherapyProgress() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30")
  const [selectedTherapy, setSelectedTherapy] = useState("all")

  const therapyPlans: TherapyPlan[] = [
    {
      id: "1",
      name: "Panchakarma Detox Program",
      totalSessions: 21,
      completedSessions: 12,
      startDate: "2024-01-01",
      expectedEndDate: "2024-02-15",
      status: "active",
      goals: ["Complete detoxification", "Improve digestion", "Reduce stress levels", "Balance doshas"],
      currentPhase: "Purvakarma (Preparation)",
    },
    {
      id: "2",
      name: "Abhyanga Therapy Series",
      totalSessions: 8,
      completedSessions: 6,
      startDate: "2023-12-15",
      expectedEndDate: "2024-01-30",
      status: "active",
      goals: ["Improve circulation", "Reduce muscle tension", "Enhance skin health"],
      currentPhase: "Maintenance Phase",
    },
    {
      id: "3",
      name: "Shirodhara Stress Relief",
      totalSessions: 5,
      completedSessions: 5,
      startDate: "2023-11-01",
      expectedEndDate: "2023-12-01",
      status: "completed",
      goals: ["Reduce anxiety", "Improve sleep quality", "Mental clarity"],
      currentPhase: "Completed",
    },
  ]

  const recentSessions: TherapySession[] = [
    {
      id: "1",
      date: "2024-01-14",
      therapy: "Abhyanga",
      duration: 60,
      practitioner: "Dr. Priya Sharma",
      notes: "Good response to treatment, patient reported feeling more relaxed",
      rating: 5,
      symptoms: ["muscle tension", "stress"],
      improvements: ["better sleep", "reduced anxiety"],
    },
    {
      id: "2",
      date: "2024-01-12",
      therapy: "Panchakarma Consultation",
      duration: 45,
      practitioner: "Dr. Raj Patel",
      notes: "Progress assessment, adjusting treatment plan",
      rating: 4,
      symptoms: ["digestive issues"],
      improvements: ["increased energy", "better appetite"],
    },
    {
      id: "3",
      date: "2024-01-10",
      therapy: "Basti",
      duration: 90,
      practitioner: "Dr. Priya Sharma",
      notes: "Detoxification phase progressing well",
      rating: 4,
      symptoms: ["bloating", "fatigue"],
      improvements: ["clearer skin", "better digestion"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "paused":
        return "outline"
      default:
        return "outline"
    }
  }

  const calculateOverallProgress = () => {
    const activePlans = therapyPlans.filter((plan) => plan.status === "active")
    if (activePlans.length === 0) return 0

    const totalProgress = activePlans.reduce((sum, plan) => {
      return sum + (plan.completedSessions / plan.totalSessions) * 100
    }, 0)

    return Math.round(totalProgress / activePlans.length)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Therapy Progress</h2>
          <p className="text-muted-foreground">Track your healing journey and recovery milestones</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{calculateOverallProgress()}%</p>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recentSessions.length}</p>
                <p className="text-sm text-muted-foreground">Sessions This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{therapyPlans.filter((p) => p.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">Active Programs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{therapyPlans.filter((p) => p.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">Completed Programs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Therapy Programs</TabsTrigger>
          <TabsTrigger value="sessions">Session History</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="wellness">Wellness Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressChart timeframe={selectedTimeframe} />
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your latest progress milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Completed Shirodhara Series</p>
                    <p className="text-sm text-green-600">5/5 sessions completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Halfway Through Detox</p>
                    <p className="text-sm text-blue-600">12/21 sessions completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <Activity className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800">Improved Sleep Quality</p>
                    <p className="text-sm text-amber-600">Reported in last 3 sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          {therapyPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      <Badge variant={getStatusColor(plan.status)}>{plan.status}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {plan.startDate} - {plan.expectedEndDate} • {plan.currentPhase}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {plan.completedSessions}/{plan.totalSessions}
                    </p>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round((plan.completedSessions / plan.totalSessions) * 100)}%</span>
                  </div>
                  <Progress value={(plan.completedSessions / plan.totalSessions) * 100} className="h-2" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Treatment Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.goals.map((goal, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          {recentSessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{session.therapy}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString()} • {session.duration} minutes •{" "}
                      {session.practitioner}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${i < session.rating ? "bg-secondary" : "bg-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Symptoms Addressed</h5>
                    <div className="flex flex-wrap gap-1">
                      {session.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Improvements Noted</h5>
                    <div className="flex flex-wrap gap-1">
                      {session.improvements.map((improvement, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                          {improvement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {session.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{session.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="milestones">
          <MilestoneTracker />
        </TabsContent>

        <TabsContent value="wellness">
          <WellnessMetrics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

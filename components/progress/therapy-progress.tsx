"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, TrendingUp, Target, Calendar, Users, BarChart3, LineChart, PieChart, Plus, Edit, Eye, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ProgressService, TherapyProgress as TherapyProgressType, TreatmentPlan } from "@/lib/progress-service"
import { useToast } from "@/hooks/use-toast"

interface TherapySession {
  id: string
  patientId: string
  patientName: string
  therapy: string
  sessionNumber: number
  date: string
  duration: number
  symptomsBefore: string[]
  symptomsAfter: string[]
  improvements: string[]
  practitionerNotes: string
  nextSessionRecommendations: string
}

interface TherapyProgress {
  id: string
  patientId: string
  patientName: string
  therapy: string
  totalSessions: number
  completedSessions: number
  startDate: string
  expectedEndDate: string
  currentPhase: string
  overallProgress: number
  sessions: TherapySession[]
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  achieved: boolean
  achievedDate?: string
}

export function TherapyProgress() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [progressData, setProgressData] = useState<TherapyProgressType[]>([])
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')

  useEffect(() => {
    if (profile) {
      loadProgressData()
    }
  }, [profile])

  // Auto-select first progress item when data loads
  useEffect(() => {
    if (progressData.length > 0 && !selectedPatient) {
      setSelectedPatient(progressData[0].id)
    }
  }, [progressData, selectedPatient])

  const loadProgressData = async () => {
    if (!profile) return
    
    setLoading(true)
    try {
      if (profile.user_type === 'patient') {
        const [progressDataResult, treatmentPlansResult] = await Promise.all([
          ProgressService.getTherapyProgress(profile.id),
          ProgressService.getTreatmentPlans(profile.id)
        ])
        setProgressData(progressDataResult)
        setTreatmentPlans(treatmentPlansResult)
      } else if (profile.user_type === 'practitioner') {
        const [progressDataResult, treatmentPlansResult] = await Promise.all([
          ProgressService.getTherapyProgressByPractitioner(profile.id),
          ProgressService.getTreatmentPlansByPractitioner(profile.id)
        ])
        setProgressData(progressDataResult)
        setTreatmentPlans(treatmentPlansResult)
      }
    } catch (error) {
      console.error('Error loading progress data:', error)
      toast({
        title: "Error",
        description: "Failed to load progress data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'early treatment': return 'bg-blue-100 text-blue-800'
      case 'mid-treatment': return 'bg-yellow-100 text-yellow-800'
      case 'late treatment': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const selectedProgress = progressData.find(p => p.id === selectedPatient)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Therapy Progress</h2>
          <p className="text-muted-foreground">Track patient progress with visual analytics and milestone tracking</p>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: 'overview' | 'detailed') => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="detailed">Detailed View</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Session
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Progress Overview</TabsTrigger>
          <TabsTrigger value="sessions">Session Details</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading progress data...</span>
              </div>
            ) : progressData.length > 0 ? (
              progressData.map((progress) => {
                const patientName = progress.appointments?.patients ? 
                  `${progress.appointments.patients.first_name} ${progress.appointments.patients.last_name}` : 
                  'Unknown Patient'
                const therapy = progress.appointments?.therapy || progress.therapies?.name || 'Unknown Therapy'
                const overallProgress = treatmentPlans.length > 0 ? 
                  Math.round((treatmentPlans[0].completed_sessions / treatmentPlans[0].total_sessions) * 100) : 0
                
                return (
                  <Card key={progress.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Activity className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{patientName}</h4>
                              <Badge variant="outline">{therapy}</Badge>
                              <Badge className="bg-blue-100 text-blue-800">
                                Session {progress.session_number}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              Session {progress.session_number} • 
                              {new Date(progress.created_at).toLocaleDateString()}
                            </p>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{overallProgress}%</span>
                              </div>
                              <Progress value={overallProgress} className="h-2" />
                            </div>

                            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {progress.session_number} sessions completed
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                {progress.improvements.length} improvements noted
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPatient(progress.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Progress Data</h3>
                  <p className="text-muted-foreground">No therapy progress data available yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          {selectedProgress ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Session Details - {selectedProgress.appointments?.patients ? 
                    `${selectedProgress.appointments.patients.first_name} ${selectedProgress.appointments.patients.last_name}` : 
                    'Unknown Patient'
                  }
                </h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Session {selectedProgress.session_number}</CardTitle>
                      <CardDescription>
                        {new Date(selectedProgress.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Symptoms Before</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProgress.symptoms_before.length > 0 ? (
                          selectedProgress.symptoms_before.map((symptom, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">None recorded</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Symptoms After</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProgress.symptoms_after.length > 0 ? (
                          selectedProgress.symptoms_after.map((symptom, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50">
                              {symptom}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">None recorded</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Improvements</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedProgress.improvements.length > 0 ? (
                        selectedProgress.improvements.map((improvement, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                            {improvement}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">None recorded</span>
                      )}
                    </div>
                  </div>

                  {selectedProgress.practitioner_assessment && (
                    <div>
                      <h4 className="font-semibold mb-2">Practitioner Assessment</h4>
                      <p className="text-sm text-muted-foreground">{selectedProgress.practitioner_assessment}</p>
                    </div>
                  )}

                  {selectedProgress.next_session_recommendations && (
                    <div>
                      <h4 className="font-semibold mb-2">Next Session Recommendations</h4>
                      <p className="text-sm text-muted-foreground">{selectedProgress.next_session_recommendations}</p>
                    </div>
                  )}

                  {selectedProgress.progress_notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Progress Notes</h4>
                      <p className="text-sm text-muted-foreground">{selectedProgress.progress_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a Session</h3>
                <p className="text-muted-foreground">Choose a session from the overview to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Treatment Plans</h3>
              <p className="text-muted-foreground">View and manage treatment plans and milestones</p>
              {treatmentPlans.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {treatmentPlans.map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{plan.name}</h4>
                        <Badge variant={plan.status === 'active' ? 'default' : 'outline'}>
                          {plan.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Sessions: {plan.completed_sessions}/{plan.total_sessions}</span>
                        <span>Started: {new Date(plan.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={(plan.completed_sessions / plan.total_sessions) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mt-4">No treatment plans available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading analytics...</span>
                    </div>
                  ) : progressData.length > 0 ? (
                    progressData.map((progress) => {
                      const patientName = progress.appointments?.patients ? 
                        `${progress.appointments.patients.first_name} ${progress.appointments.patients.last_name}` : 
                        'Unknown Patient'
                      const overallProgress = treatmentPlans.length > 0 ? 
                        Math.round((treatmentPlans[0].completed_sessions / treatmentPlans[0].total_sessions) * 100) : 0
                      
                      return (
                        <div key={progress.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{patientName}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={overallProgress} className="w-24 h-2" />
                            <span className="text-sm text-muted-foreground w-12">{overallProgress}%</span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No progress data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Improvement Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading improvements...</span>
                    </div>
                  ) : progressData.length > 0 ? (
                    (() => {
                      const allImprovements = progressData.flatMap(p => p.improvements)
                      const improvementCounts = allImprovements.reduce((acc: Record<string, number>, improvement) => {
                        acc[improvement] = (acc[improvement] || 0) + 1
                        return acc
                      }, {})
                      
                      const topImprovements = Object.entries(improvementCounts)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                      
                      return topImprovements.map(([improvement, count]) => (
                        <div key={improvement} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{improvement}</span>
                          <Badge className="bg-green-100 text-green-800">{count} times</Badge>
                        </div>
                      ))
                    })()
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No improvement data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
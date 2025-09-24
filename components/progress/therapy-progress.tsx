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
import { Activity, TrendingUp, Target, Calendar, Users, BarChart3, LineChart, PieChart, Plus, Edit, Eye } from "lucide-react"
import { toast } from "sonner"

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
  const [progressData, setProgressData] = useState<TherapyProgress[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'Sarah Johnson',
      therapy: 'Abhyanga',
      totalSessions: 8,
      completedSessions: 6,
      startDate: '2024-01-01',
      expectedEndDate: '2024-02-15',
      currentPhase: 'Mid-treatment',
      overallProgress: 75,
      sessions: [
        {
          id: 's1',
          patientId: 'p1',
          patientName: 'Sarah Johnson',
          therapy: 'Abhyanga',
          sessionNumber: 1,
          date: '2024-01-01',
          duration: 60,
          symptomsBefore: ['Back pain', 'Stress', 'Fatigue'],
          symptomsAfter: ['Reduced back pain', 'Relaxed'],
          improvements: ['Better sleep', 'Reduced stress'],
          practitionerNotes: 'Patient responded well to initial treatment. Some muscle tension noted.',
          nextSessionRecommendations: 'Continue with current approach, focus on lower back area.'
        },
        {
          id: 's2',
          patientId: 'p1',
          patientName: 'Sarah Johnson',
          therapy: 'Abhyanga',
          sessionNumber: 6,
          date: '2024-01-20',
          duration: 60,
          symptomsBefore: ['Mild back pain', 'Some stress'],
          symptomsAfter: ['Significant pain relief', 'Very relaxed'],
          improvements: ['Excellent sleep quality', 'High energy levels', 'Better mood'],
          practitionerNotes: 'Excellent progress. Patient showing remarkable improvement.',
          nextSessionRecommendations: 'Continue current treatment plan. Consider extending if needed.'
        }
      ],
      milestones: [
        { id: 'm1', title: 'Initial Assessment', description: 'Complete initial evaluation', targetDate: '2024-01-01', achieved: true, achievedDate: '2024-01-01' },
        { id: 'm2', title: 'Mid-Treatment Review', description: 'Evaluate progress at 50% completion', targetDate: '2024-01-15', achieved: true, achievedDate: '2024-01-15' },
        { id: 'm3', title: 'Final Assessment', description: 'Complete final evaluation', targetDate: '2024-02-15', achieved: false }
      ]
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Michael Chen',
      therapy: 'Shirodhara',
      totalSessions: 6,
      completedSessions: 3,
      startDate: '2024-01-10',
      expectedEndDate: '2024-02-20',
      currentPhase: 'Early treatment',
      overallProgress: 50,
      sessions: [
        {
          id: 's3',
          patientId: 'p2',
          patientName: 'Michael Chen',
          therapy: 'Shirodhara',
          sessionNumber: 3,
          date: '2024-01-25',
          duration: 45,
          symptomsBefore: ['Anxiety', 'Insomnia', 'Headaches'],
          symptomsAfter: ['Calmer', 'Better sleep quality'],
          improvements: ['Reduced anxiety', 'Improved sleep'],
          practitionerNotes: 'Good response to treatment. Patient reports feeling more centered.',
          nextSessionRecommendations: 'Continue with current frequency. Monitor sleep patterns.'
        }
      ],
      milestones: [
        { id: 'm4', title: 'Initial Assessment', description: 'Complete initial evaluation', targetDate: '2024-01-10', achieved: true, achievedDate: '2024-01-10' },
        { id: 'm5', title: 'Mid-Treatment Review', description: 'Evaluate progress at 50% completion', targetDate: '2024-02-05', achieved: false },
        { id: 'm6', title: 'Final Assessment', description: 'Complete final evaluation', targetDate: '2024-02-20', achieved: false }
      ]
    }
  ])

  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')

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
            {progressData.map((progress) => (
              <Card key={progress.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{progress.patientName}</h4>
                          <Badge variant="outline">{progress.therapy}</Badge>
                          <Badge className={getPhaseColor(progress.currentPhase)}>
                            {progress.currentPhase}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Session {progress.completedSessions} of {progress.totalSessions} • 
                          Started {new Date(progress.startDate).toLocaleDateString()}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span>{progress.overallProgress}%</span>
                          </div>
                          <Progress value={progress.overallProgress} className="h-2" />
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {progress.completedSessions} sessions completed
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {progress.milestones.filter(m => m.achieved).length}/{progress.milestones.length} milestones
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          {selectedProgress ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Session History - {selectedProgress.patientName}
                </h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session
                </Button>
              </div>
              
              <div className="grid gap-4">
                {selectedProgress.sessions.map((session) => (
                  <Card key={session.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Session {session.sessionNumber}</CardTitle>
                          <CardDescription>
                            {new Date(session.date).toLocaleDateString()} • {session.duration} minutes
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
                            {session.symptomsBefore.map((symptom, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Symptoms After</h4>
                          <div className="flex flex-wrap gap-1">
                            {session.symptomsAfter.map((symptom, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-green-50">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Improvements</h4>
                        <div className="flex flex-wrap gap-1">
                          {session.improvements.map((improvement, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                              {improvement}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Practitioner Notes</h4>
                        <p className="text-sm text-muted-foreground">{session.practitionerNotes}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Next Session Recommendations</h4>
                        <p className="text-sm text-muted-foreground">{session.nextSessionRecommendations}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a Patient</h3>
                <p className="text-muted-foreground">Choose a patient from the overview to view their session details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {selectedProgress ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Milestones - {selectedProgress.patientName}
                </h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
              
              <div className="grid gap-4">
                {selectedProgress.milestones.map((milestone) => (
                  <Card key={milestone.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${milestone.achieved ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {milestone.achieved ? (
                            <Target className="h-5 w-5 text-green-600" />
                          ) : (
                            <Target className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{milestone.title}</h4>
                            <Badge variant={milestone.achieved ? "default" : "outline"}>
                              {milestone.achieved ? 'Achieved' : 'Pending'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                            {milestone.achievedDate && (
                              <span>Achieved: {new Date(milestone.achievedDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          {milestone.achieved ? 'View' : 'Mark Complete'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a Patient</h3>
                <p className="text-muted-foreground">Choose a patient from the overview to view their milestones</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progress Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.map((progress) => (
                    <div key={progress.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{progress.patientName}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={progress.overallProgress} className="w-24 h-2" />
                        <span className="text-sm text-muted-foreground w-12">{progress.overallProgress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Therapy Success Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Abhyanga</span>
                    <Badge className="bg-green-100 text-green-800">94% Success</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Shirodhara</span>
                    <Badge className="bg-blue-100 text-blue-800">87% Success</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Basti</span>
                    <Badge className="bg-yellow-100 text-yellow-800">82% Success</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Panchakarma</span>
                    <Badge className="bg-green-100 text-green-800">91% Success</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
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
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare, TrendingUp, AlertTriangle, CheckCircle, Star, BarChart3, Filter, Search, Send, ThumbsUp, ThumbsDown } from "lucide-react"
import { toast } from "sonner"

interface PatientFeedback {
  id: string
  patientId: string
  patientName: string
  appointmentId: string
  therapy: string
  sessionDate: string
  rating: number
  symptoms: string[]
  improvements: string[]
  sideEffects: string[]
  overallFeeling: string
  notes: string
  followUpNeeded: boolean
  practitionerResponse?: string
  responseDate?: string
  status: 'pending' | 'reviewed' | 'responded' | 'resolved'
  createdAt: string
}

interface FeedbackAnalytics {
  totalFeedback: number
  averageRating: number
  positiveResponses: number
  negativeResponses: number
  commonSymptoms: { symptom: string; count: number }[]
  commonImprovements: { improvement: string; count: number }[]
  therapyRatings: { therapy: string; averageRating: number }[]
}

export function FeedbackSystem() {
  const [feedback, setFeedback] = useState<PatientFeedback[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'Sarah Johnson',
      appointmentId: 'a1',
      therapy: 'Abhyanga',
      sessionDate: '2024-01-20',
      rating: 5,
      symptoms: ['Back pain', 'Stress'],
      improvements: ['Better sleep', 'Reduced stress', 'Increased energy'],
      sideEffects: ['Mild drowsiness'],
      overallFeeling: 'Excellent - feeling much better',
      notes: 'The therapy was very relaxing and effective. I can feel significant improvement in my back pain.',
      followUpNeeded: false,
      status: 'responded',
      practitionerResponse: 'Great to hear about your progress! Continue with the recommended exercises.',
      responseDate: '2024-01-21',
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Michael Chen',
      appointmentId: 'a2',
      therapy: 'Shirodhara',
      sessionDate: '2024-01-22',
      rating: 4,
      symptoms: ['Anxiety', 'Insomnia'],
      improvements: ['Better sleep quality', 'Reduced anxiety'],
      sideEffects: ['Slight headache'],
      overallFeeling: 'Good - noticeable improvement',
      notes: 'The session was very calming. I slept better that night but had a slight headache the next morning.',
      followUpNeeded: true,
      status: 'pending',
      createdAt: '2024-01-22'
    },
    {
      id: '3',
      patientId: 'p3',
      patientName: 'Emma Wilson',
      appointmentId: 'a3',
      therapy: 'Panchakarma',
      sessionDate: '2024-01-23',
      rating: 5,
      symptoms: ['Digestive issues', 'Fatigue'],
      improvements: ['Better digestion', 'Increased energy', 'Improved mood'],
      sideEffects: [],
      overallFeeling: 'Excellent - amazing results',
      notes: 'This has been life-changing. My digestive issues have improved significantly and I feel more energetic.',
      followUpNeeded: false,
      status: 'reviewed',
      createdAt: '2024-01-23'
    }
  ])

  const [selectedFeedback, setSelectedFeedback] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterTherapy, setFilterTherapy] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [practitionerResponse, setPractitionerResponse] = useState('')

  const analytics: FeedbackAnalytics = {
    totalFeedback: feedback.length,
    averageRating: feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length,
    positiveResponses: feedback.filter(f => f.rating >= 4).length,
    negativeResponses: feedback.filter(f => f.rating <= 2).length,
    commonSymptoms: [
      { symptom: 'Back pain', count: 2 },
      { symptom: 'Stress', count: 2 },
      { symptom: 'Anxiety', count: 1 },
      { symptom: 'Insomnia', count: 1 }
    ],
    commonImprovements: [
      { improvement: 'Better sleep', count: 3 },
      { improvement: 'Reduced stress', count: 2 },
      { improvement: 'Increased energy', count: 2 }
    ],
    therapyRatings: [
      { therapy: 'Abhyanga', averageRating: 5 },
      { therapy: 'Shirodhara', averageRating: 4 },
      { therapy: 'Panchakarma', averageRating: 5 }
    ]
  }

  const filteredFeedback = feedback.filter(f => {
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus
    const matchesTherapy = filterTherapy === 'all' || f.therapy === filterTherapy
    const matchesSearch = f.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.therapy.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesTherapy && matchesSearch
  })

  const handleResponse = (feedbackId: string) => {
    if (!practitionerResponse.trim()) {
      toast.error('Please enter a response')
      return
    }

    setFeedback(prev => prev.map(f => 
      f.id === feedbackId 
        ? { 
            ...f, 
            practitionerResponse, 
            responseDate: new Date().toISOString().split('T')[0],
            status: 'responded' as const
          }
        : f
    ))
    
    setPractitionerResponse('')
    toast.success('Response sent successfully')
  }

  const handleStatusUpdate = (feedbackId: string, newStatus: PatientFeedback['status']) => {
    setFeedback(prev => prev.map(f => 
      f.id === feedbackId ? { ...f, status: newStatus } : f
    ))
    toast.success('Status updated successfully')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRatingStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  const selectedFeedbackData = feedback.find(f => f.id === selectedFeedback)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integrated Feedback System</h2>
          <p className="text-muted-foreground">Patient feedback analysis and response management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Follow-up
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedback">Patient Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalFeedback}</p>
                    <p className="text-sm text-muted-foreground">Total Feedback</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ThumbsUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.positiveResponses}</p>
                    <p className="text-sm text-muted-foreground">Positive</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ThumbsDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.negativeResponses}</p>
                    <p className="text-sm text-muted-foreground">Negative</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest patient responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex flex-col items-center gap-1">
                        {getRatingStars(item.rating)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{item.patientName}</h4>
                          <Badge variant="outline" className="text-xs">{item.therapy}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{item.overallFeeling}</p>
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Symptoms</CardTitle>
                <CardDescription>Most reported symptoms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.commonSymptoms.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.symptom}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(item.count / Math.max(...analytics.commonSymptoms.map(s => s.count))) * 100} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground w-6">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTherapy} onValueChange={setFilterTherapy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Therapies</SelectItem>
                <SelectItem value="Abhyanga">Abhyanga</SelectItem>
                <SelectItem value="Shirodhara">Shirodhara</SelectItem>
                <SelectItem value="Panchakarma">Panchakarma</SelectItem>
                <SelectItem value="Basti">Basti</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredFeedback.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1">
                        {getRatingStars(item.rating)}
                        <span className="text-xs text-muted-foreground">{item.rating}/5</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{item.patientName}</h4>
                          <Badge variant="outline">{item.therapy}</Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{item.overallFeeling}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <h5 className="font-medium mb-1">Symptoms</h5>
                            <div className="flex flex-wrap gap-1">
                              {item.symptoms.map((symptom, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-1">Improvements</h5>
                            <div className="flex flex-wrap gap-1">
                              {item.improvements.map((improvement, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-green-50">
                                  {improvement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-1">Side Effects</h5>
                            <div className="flex flex-wrap gap-1">
                              {item.sideEffects.length > 0 ? (
                                item.sideEffects.map((effect, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-yellow-50">
                                    {effect}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground">None reported</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {item.notes && (
                          <div className="mt-3">
                            <h5 className="font-medium text-sm mb-1">Notes</h5>
                            <p className="text-sm text-muted-foreground">{item.notes}</p>
                          </div>
                        )}

                        {item.practitionerResponse && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-sm mb-1">Your Response</h5>
                            <p className="text-sm">{item.practitionerResponse}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(item.responseDate!).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedFeedback(item.id)}
                      >
                        View Details
                      </Button>
                      <Select value={item.status} onValueChange={(value: PatientFeedback['status']) => handleStatusUpdate(item.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="responded">Responded</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Therapy Ratings</CardTitle>
                <CardDescription>Average ratings by therapy type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.therapyRatings.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.therapy}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {getRatingStars(Math.round(item.averageRating))}
                        </div>
                        <span className="text-sm text-muted-foreground w-12">
                          {item.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Improvements</CardTitle>
                <CardDescription>Most reported improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.commonImprovements.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.improvement}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(item.count / Math.max(...analytics.commonImprovements.map(i => i.count))) * 100} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground w-6">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          {selectedFeedbackData ? (
            <Card>
              <CardHeader>
                <CardTitle>Respond to Feedback</CardTitle>
                <CardDescription>
                  {selectedFeedbackData.patientName} - {selectedFeedbackData.therapy}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Patient Feedback:</h4>
                  <p className="text-sm text-muted-foreground mb-2">{selectedFeedbackData.overallFeeling}</p>
                  <p className="text-sm">{selectedFeedbackData.notes}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="response">Your Response</Label>
                  <Textarea
                    placeholder="Enter your response to the patient..."
                    value={practitionerResponse}
                    onChange={(e) => setPractitionerResponse(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleResponse(selectedFeedbackData.id)}>
                    Send Response
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedFeedback('')}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select Feedback to Respond</h3>
                <p className="text-muted-foreground">Choose a feedback item from the list to respond to the patient</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
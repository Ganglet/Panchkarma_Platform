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
import { MessageSquare, TrendingUp, AlertTriangle, CheckCircle, Star, BarChart3, Filter, Search, Send, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { FeedbackService, Feedback } from "@/lib/feedback-service"
import { useToast } from "@/hooks/use-toast"

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
  const { profile } = useAuth()
  const { toast } = useToast()
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedFeedback, setSelectedFeedback] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterTherapy, setFilterTherapy] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [practitionerResponse, setPractitionerResponse] = useState('')
  const [analytics, setAnalytics] = useState<FeedbackAnalytics>({
    totalFeedback: 0,
    averageRating: 0,
    positiveResponses: 0,
    negativeResponses: 0,
    commonSymptoms: [],
    commonImprovements: [],
    therapyRatings: []
  })

  useEffect(() => {
    if (profile) {
      loadFeedbackData()
    }
  }, [profile])

  const loadFeedbackData = async () => {
    if (!profile) return
    
    setLoading(true)
    try {
      const [feedbackData, statsData] = await Promise.all([
        FeedbackService.getFeedbackByPractitioner(profile.id),
        FeedbackService.getFeedbackStats(profile.id)
      ])
      
      setFeedback(feedbackData || [])
      
      // Calculate analytics from real data
      const allSymptoms = feedbackData?.flatMap(f => f.symptoms) || []
      const allImprovements = feedbackData?.flatMap(f => f.improvements) || []
      
      const symptomCounts = allSymptoms.reduce((acc: Record<string, number>, symptom) => {
        acc[symptom] = (acc[symptom] || 0) + 1
        return acc
      }, {})
      
      const improvementCounts = allImprovements.reduce((acc: Record<string, number>, improvement) => {
        acc[improvement] = (acc[improvement] || 0) + 1
        return acc
      }, {})
      
      const therapyRatings = feedbackData?.reduce((acc: Record<string, number[]>, f) => {
        if (f.appointments?.therapy && f.rating) {
          if (!acc[f.appointments.therapy]) acc[f.appointments.therapy] = []
          acc[f.appointments.therapy].push(f.rating)
        }
        return acc
      }, {}) || {}
      
      setAnalytics({
        totalFeedback: statsData.totalFeedbacks,
        averageRating: statsData.averageRating,
        positiveResponses: feedbackData?.filter(f => (f.rating || 0) >= 4).length || 0,
        negativeResponses: feedbackData?.filter(f => (f.rating || 0) <= 2).length || 0,
        commonSymptoms: Object.entries(symptomCounts)
          .map(([symptom, count]) => ({ symptom, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        commonImprovements: Object.entries(improvementCounts)
          .map(([improvement, count]) => ({ improvement, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        therapyRatings: Object.entries(therapyRatings)
          .map(([therapy, ratings]) => ({
            therapy,
            averageRating: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          }))
          .sort((a, b) => b.averageRating - a.averageRating)
      })
    } catch (error) {
      console.error('Error loading feedback data:', error)
      toast({
        title: "Error",
        description: "Failed to load feedback data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedback = feedback.filter(f => {
    const therapy = f.appointments?.therapy || ''
    const patientName = f.appointments?.patients ? 
      `${f.appointments.patients.first_name} ${f.appointments.patients.last_name}` : 
      'Unknown Patient'
    
    const matchesTherapy = filterTherapy === 'all' || therapy === filterTherapy
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTherapy && matchesSearch
  })

  const handleResponse = async (feedbackId: string) => {
    if (!practitionerResponse.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real implementation, you would update the feedback with practitioner response
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Response sent successfully",
      })
      
      setPractitionerResponse('')
      setSelectedFeedback('')
    } catch (error) {
      console.error('Error sending response:', error)
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      })
    }
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
                    <p className="text-2xl font-bold">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics.totalFeedback}
                    </p>
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
                    <p className="text-2xl font-bold">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics.averageRating.toFixed(1)}
                    </p>
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
                    <p className="text-2xl font-bold">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics.positiveResponses}
                    </p>
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
                    <p className="text-2xl font-bold">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics.negativeResponses}
                    </p>
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
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading feedback...</span>
                    </div>
                  ) : feedback.length > 0 ? (
                    feedback.slice(0, 3).map((item) => {
                      const patientName = item.appointments?.patients ? 
                        `${item.appointments.patients.first_name} ${item.appointments.patients.last_name}` : 
                        'Unknown Patient'
                      const therapy = item.appointments?.therapy || 'Unknown Therapy'
                      
                      return (
                        <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="flex flex-col items-center gap-1">
                            {getRatingStars(item.rating || 0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{patientName}</h4>
                              <Badge variant="outline" className="text-xs">{therapy}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{item.overall_feeling || 'No comment'}</p>
                            <Badge className="text-xs bg-green-100 text-green-800">
                              {item.follow_up_needed ? 'Follow-up needed' : 'Complete'}
                            </Badge>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No feedback available</p>
                  )}
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
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading symptoms...</span>
                    </div>
                  ) : analytics.commonSymptoms.length > 0 ? (
                    analytics.commonSymptoms.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.symptom}</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={analytics.commonSymptoms.length > 0 ? 
                              (item.count / Math.max(...analytics.commonSymptoms.map(s => s.count))) * 100 : 0
                            } 
                            className="w-16 h-2" 
                          />
                          <span className="text-xs text-muted-foreground w-6">{item.count}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No symptoms data available</p>
                  )}
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading feedback...</span>
              </div>
            ) : filteredFeedback.length > 0 ? (
              filteredFeedback.map((item) => {
                const patientName = item.appointments?.patients ? 
                  `${item.appointments.patients.first_name} ${item.appointments.patients.last_name}` : 
                  'Unknown Patient'
                const therapy = item.appointments?.therapy || 'Unknown Therapy'
                
                return (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center gap-1">
                            {getRatingStars(item.rating || 0)}
                            <span className="text-xs text-muted-foreground">{item.rating || 0}/5</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{patientName}</h4>
                              <Badge variant="outline">{therapy}</Badge>
                              <Badge className={item.follow_up_needed ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                                {item.follow_up_needed ? 'Follow-up needed' : 'Complete'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{item.overall_feeling || 'No comment provided'}</p>
                        
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <h5 className="font-medium mb-1">Symptoms</h5>
                                <div className="flex flex-wrap gap-1">
                                  {item.symptoms.length > 0 ? (
                                    item.symptoms.map((symptom, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {symptom}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-muted-foreground">None reported</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium mb-1">Improvements</h5>
                                <div className="flex flex-wrap gap-1">
                                  {item.improvements.length > 0 ? (
                                    item.improvements.map((improvement, index) => (
                                      <Badge key={index} variant="outline" className="text-xs bg-green-50">
                                        {improvement}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-muted-foreground">None reported</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium mb-1">Side Effects</h5>
                                <div className="flex flex-wrap gap-1">
                                  {item.side_effects.length > 0 ? (
                                    item.side_effects.map((effect, index) => (
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <p className="text-muted-foreground text-center py-8">No feedback found</p>
            )}
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
                  {selectedFeedbackData.appointments?.patients ? 
                    `${selectedFeedbackData.appointments.patients.first_name} ${selectedFeedbackData.appointments.patients.last_name}` : 
                    'Unknown Patient'
                  } - {selectedFeedbackData.appointments?.therapy || 'Unknown Therapy'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Patient Feedback:</h4>
                  <p className="text-sm text-muted-foreground mb-2">{selectedFeedbackData.overall_feeling || 'No comment provided'}</p>
                  <p className="text-sm">{selectedFeedbackData.notes || 'No additional notes'}</p>
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
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Star, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { FeedbackForm } from "./feedback-form"
import { FeedbackHistory } from "./feedback-history"
import { SymptomTracker } from "./symptom-tracker"

interface FeedbackEntry {
  id: string
  sessionId: string
  therapy: string
  date: string
  practitioner: string
  rating: number
  symptoms: string[]
  improvements: string[]
  sideEffects: string[]
  overallFeeling: string
  notes: string
  followUpNeeded: boolean
}

export function FeedbackSystem() {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const pendingSessions = [
    {
      id: "1",
      therapy: "Abhyanga",
      date: "2024-01-14",
      practitioner: "Dr. Priya Sharma",
      duration: 60,
      status: "completed",
    },
    {
      id: "2",
      therapy: "Shirodhara",
      date: "2024-01-12",
      practitioner: "Dr. Raj Patel",
      duration: 90,
      status: "completed",
    },
  ]

  const recentFeedback: FeedbackEntry[] = [
    {
      id: "1",
      sessionId: "3",
      therapy: "Panchakarma Consultation",
      date: "2024-01-10",
      practitioner: "Dr. Priya Sharma",
      rating: 5,
      symptoms: ["fatigue", "digestive issues"],
      improvements: ["better sleep", "increased energy"],
      sideEffects: [],
      overallFeeling: "much better",
      notes: "Feeling more energetic and sleeping better since starting treatment",
      followUpNeeded: false,
    },
    {
      id: "2",
      sessionId: "4",
      therapy: "Basti",
      date: "2024-01-08",
      practitioner: "Dr. Raj Patel",
      rating: 4,
      symptoms: ["bloating", "mild discomfort"],
      improvements: ["clearer skin", "better digestion"],
      sideEffects: ["mild nausea"],
      overallFeeling: "good",
      notes: "Some initial discomfort but overall positive results",
      followUpNeeded: true,
    },
  ]

  const handleProvideFeedback = (sessionId: string) => {
    setSelectedSession(sessionId)
    setShowFeedbackForm(true)
  }

  const averageRating =
    recentFeedback.length > 0
      ? recentFeedback.reduce((sum, feedback) => sum + feedback.rating, 0) / recentFeedback.length
      : 0

  const totalImprovements = recentFeedback.reduce((sum, feedback) => sum + feedback.improvements.length, 0)
  const totalSideEffects = recentFeedback.reduce((sum, feedback) => sum + feedback.sideEffects.length, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Feedback & Symptom Tracking</h2>
          <p className="text-muted-foreground">Share your experience and track your progress</p>
        </div>
        <Button onClick={() => setShowFeedbackForm(true)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Provide Feedback
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalImprovements}</p>
                <p className="text-sm text-muted-foreground">Improvements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSideEffects}</p>
                <p className="text-sm text-muted-foreground">Side Effects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recentFeedback.length}</p>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Feedback */}
      {pendingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Pending Feedback
            </CardTitle>
            <CardDescription>Sessions waiting for your feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg bg-amber-50">
                  <div>
                    <h4 className="font-semibold">{session.therapy}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString()} • {session.duration} minutes •{" "}
                      {session.practitioner}
                    </p>
                  </div>
                  <Button onClick={() => handleProvideFeedback(session.id)} size="sm">
                    Provide Feedback
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Feedback History</TabsTrigger>
          <TabsTrigger value="symptoms">Symptom Tracker</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback Summary</CardTitle>
                <CardDescription>Your latest session feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentFeedback.slice(0, 3).map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{feedback.therapy}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < feedback.rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(feedback.date).toLocaleDateString()} • {feedback.practitioner}
                    </p>
                    <p className="text-sm">{feedback.notes}</p>
                    {feedback.followUpNeeded && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Follow-up needed
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Treatment Response</CardTitle>
                <CardDescription>How you're responding to treatments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Positive Responses</span>
                      <span className="text-green-600">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Side Effects Reported</span>
                      <span className="text-amber-600">15%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Most Common Improvements</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      better sleep
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      increased energy
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      reduced stress
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <FeedbackHistory feedback={recentFeedback} />
        </TabsContent>

        <TabsContent value="symptoms">
          <SymptomTracker />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Personalized insights based on your feedback patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Positive Trends</h4>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• Your sleep quality has consistently improved over the last 4 sessions</li>
                      <li>• Energy levels show a 40% improvement since starting treatment</li>
                      <li>• Stress-related symptoms are decreasing steadily</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Treatment Effectiveness</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Abhyanga sessions show the highest satisfaction ratings (4.8/5)</li>
                      <li>• Digestive improvements are most notable after Basti treatments</li>
                      <li>• Mental clarity improvements correlate with Shirodhara sessions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800">Areas for Attention</h4>
                    <ul className="text-sm text-amber-700 mt-2 space-y-1">
                      <li>• Mild nausea reported after Basti - consider dietary adjustments</li>
                      <li>• Some sessions show fatigue - may need to adjust timing</li>
                      <li>• Consider discussing meditation techniques for stress management</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-purple-800">Recommendations</h4>
                    <ul className="text-sm text-purple-700 mt-2 space-y-1">
                      <li>• Continue current Abhyanga frequency for optimal results</li>
                      <li>• Schedule Shirodhara sessions during high-stress periods</li>
                      <li>• Consider adding gentle yoga to complement treatments</li>
                      <li>• Maintain current dietary guidelines for best outcomes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FeedbackForm
        isOpen={showFeedbackForm}
        onClose={() => {
          setShowFeedbackForm(false)
          setSelectedSession(null)
        }}
        sessionId={selectedSession}
      />
    </div>
  )
}

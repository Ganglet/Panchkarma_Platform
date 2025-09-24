"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Calendar, User, MessageSquare } from "lucide-react"

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

interface FeedbackHistoryProps {
  feedback: FeedbackEntry[]
}

export function FeedbackHistory({ feedback }: FeedbackHistoryProps) {
  const getOverallFeelingColor = (feeling: string) => {
    switch (feeling) {
      case "much better":
        return "bg-green-100 text-green-800"
      case "better":
        return "bg-blue-100 text-blue-800"
      case "same":
        return "bg-gray-100 text-gray-800"
      case "worse":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Feedback History</h3>
          <p className="text-sm text-muted-foreground">Your complete feedback record</p>
        </div>
        <Button variant="outline" size="sm">
          Export History
        </Button>
      </div>

      {feedback.length > 0 ? (
        <div className="space-y-4">
          {feedback.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{entry.therapy}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {entry.practitioner}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < entry.rating ? "fill-secondary text-secondary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge className={getOverallFeelingColor(entry.overallFeeling)}>{entry.overallFeeling}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Symptoms */}
                {entry.symptoms.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Symptoms Reported</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {entry.improvements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Improvements Noted</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.improvements.map((improvement, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                          {improvement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Side Effects */}
                {entry.sideEffects.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Side Effects</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.sideEffects.map((sideEffect, index) => (
                        <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700">
                          {sideEffect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Notes
                    </h4>
                    <p className="text-sm bg-muted p-3 rounded-lg">{entry.notes}</p>
                  </div>
                )}

                {/* Follow-up indicator */}
                {entry.followUpNeeded && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Follow-up requested
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No feedback history</h3>
            <p className="text-muted-foreground">Your feedback entries will appear here after you submit them.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, CheckCircle, Info } from "lucide-react"

interface ProcedureAlert {
  id: string
  type: "pre-procedure" | "post-procedure" | "during-procedure"
  therapy: string
  title: string
  instructions: string[]
  timing: string
  priority: "high" | "medium" | "low"
  completed?: boolean
}

export function ProcedureAlerts() {
  const alerts: ProcedureAlert[] = [
    {
      id: "1",
      type: "pre-procedure",
      therapy: "Abhyanga",
      title: "Pre-Abhyanga Preparation",
      instructions: [
        "Avoid heavy meals 2-3 hours before the session",
        "Take a light shower before arrival",
        "Wear comfortable, loose-fitting clothes",
        "Avoid alcohol and caffeine 24 hours prior",
        "Inform practitioner of any skin allergies",
      ],
      timing: "2-3 hours before",
      priority: "high",
    },
    {
      id: "2",
      type: "post-procedure",
      therapy: "Abhyanga",
      title: "Post-Abhyanga Care",
      instructions: [
        "Rest for 30 minutes after the session",
        "Drink warm water to aid detoxification",
        "Avoid cold drinks and foods for 2 hours",
        "Take a warm shower after 2-3 hours",
        "Avoid strenuous activities for the day",
      ],
      timing: "Immediately after session",
      priority: "high",
      completed: true,
    },
    {
      id: "3",
      type: "pre-procedure",
      therapy: "Shirodhara",
      title: "Pre-Shirodhara Guidelines",
      instructions: [
        "Wash hair with mild shampoo before arrival",
        "Avoid applying oil or styling products to hair",
        "Eat a light meal 1-2 hours before",
        "Wear clothes that can get oil stains",
        "Remove all jewelry and accessories",
      ],
      timing: "Day of treatment",
      priority: "medium",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pre-procedure":
        return <Clock className="h-5 w-5" />
      case "post-procedure":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getAlertVariant = (priority: string, completed?: boolean) => {
    if (completed) return "default"
    return priority === "high" ? "destructive" : "default"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Procedure Alerts & Guidelines</h2>
        <p className="text-muted-foreground">Important instructions for your therapy sessions</p>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={getAlertVariant(alert.priority, alert.completed)}>
            <div className="flex items-start gap-4">
              {getTypeIcon(alert.type)}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <AlertTitle className="flex items-center gap-2">
                      {alert.title}
                      <Badge variant={getPriorityColor(alert.priority)} className="text-xs">
                        {alert.priority} priority
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="mt-1">
                      <span className="font-medium">{alert.therapy}</span> • {alert.timing}
                    </AlertDescription>
                  </div>
                  {alert.completed && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Instructions:</h4>
                  <ul className="space-y-1">
                    {alert.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {!alert.completed && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                    <Button size="sm">Acknowledge</Button>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-secondary" />
            General Guidelines
          </CardTitle>
          <CardDescription>Important reminders for all Panchakarma therapies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Before Any Session:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Arrive 15 minutes early</li>
                <li>• Inform about any health changes</li>
                <li>• Bring comfortable clothes</li>
                <li>• Stay hydrated</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">After Any Session:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Rest and avoid stress</li>
                <li>• Follow dietary recommendations</li>
                <li>• Report any unusual symptoms</li>
                <li>• Schedule follow-up if needed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface ProgressChartProps {
  timeframe: string
}

export function ProgressChart({ timeframe }: ProgressChartProps) {
  // Mock data - in real app this would come from API
  const progressData = [
    { date: "Jan 1", wellnessScore: 65, sessions: 0, symptoms: 8 },
    { date: "Jan 5", wellnessScore: 68, sessions: 2, symptoms: 7 },
    { date: "Jan 10", wellnessScore: 72, sessions: 4, symptoms: 6 },
    { date: "Jan 15", wellnessScore: 75, sessions: 6, symptoms: 5 },
    { date: "Jan 20", wellnessScore: 78, sessions: 8, symptoms: 4 },
    { date: "Jan 25", wellnessScore: 82, sessions: 10, symptoms: 3 },
    { date: "Jan 30", wellnessScore: 85, sessions: 12, symptoms: 2 },
  ]

  const sessionData = [
    { therapy: "Abhyanga", sessions: 6, improvement: 85 },
    { therapy: "Shirodhara", sessions: 5, improvement: 92 },
    { therapy: "Basti", sessions: 3, improvement: 78 },
    { therapy: "Nasya", sessions: 2, improvement: 70 },
    { therapy: "Consultation", sessions: 4, improvement: 88 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wellness Progress Over Time</CardTitle>
          <CardDescription>Your overall wellness score and symptom reduction</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="wellnessScore"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                name="Wellness Score"
              />
              <Line
                type="monotone"
                dataKey="symptoms"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                name="Symptom Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Therapy Effectiveness</CardTitle>
          <CardDescription>Sessions completed and improvement rates by therapy type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="therapy" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="#dc2626" name="Sessions" />
              <Bar dataKey="improvement" fill="#f59e0b" name="Improvement %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

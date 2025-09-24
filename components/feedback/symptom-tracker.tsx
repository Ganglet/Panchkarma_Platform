"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

interface SymptomData {
  symptom: string
  severity: number
  frequency: number
  trend: "improving" | "worsening" | "stable"
  lastReported: string
  category: "physical" | "mental" | "digestive" | "sleep"
}

export function SymptomTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30")
  const [selectedSymptom, setSelectedSymptom] = useState("all")

  const symptomData: SymptomData[] = [
    {
      symptom: "Fatigue",
      severity: 3,
      frequency: 2,
      trend: "improving",
      lastReported: "2024-01-14",
      category: "physical",
    },
    {
      symptom: "Digestive Issues",
      severity: 2,
      frequency: 1,
      trend: "improving",
      lastReported: "2024-01-12",
      category: "digestive",
    },
    {
      symptom: "Sleep Problems",
      severity: 1,
      frequency: 1,
      trend: "stable",
      lastReported: "2024-01-10",
      category: "sleep",
    },
    {
      symptom: "Stress",
      severity: 2,
      frequency: 2,
      trend: "improving",
      lastReported: "2024-01-14",
      category: "mental",
    },
  ]

  // Mock trend data for chart
  const trendData = [
    { date: "Jan 1", fatigue: 8, stress: 7, digestive: 6, sleep: 5 },
    { date: "Jan 5", fatigue: 7, stress: 6, digestive: 5, sleep: 4 },
    { date: "Jan 10", fatigue: 6, stress: 5, digestive: 4, sleep: 3 },
    { date: "Jan 15", fatigue: 4, stress: 4, digestive: 3, sleep: 2 },
    { date: "Jan 20", fatigue: 3, stress: 3, digestive: 2, sleep: 2 },
    { date: "Jan 25", fatigue: 3, stress: 2, digestive: 2, sleep: 1 },
    { date: "Jan 30", fatigue: 2, stress: 2, digestive: 1, sleep: 1 },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="h-4 w-4 text-green-600" />
      case "worsening":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600"
      case "worsening":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "physical":
        return "bg-blue-100 text-blue-800"
      case "mental":
        return "bg-purple-100 text-purple-800"
      case "digestive":
        return "bg-green-100 text-green-800"
      case "sleep":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityLabel = (severity: number) => {
    switch (severity) {
      case 1:
        return "Mild"
      case 2:
        return "Moderate"
      case 3:
        return "Severe"
      default:
        return "None"
    }
  }

  const getFrequencyLabel = (frequency: number) => {
    switch (frequency) {
      case 1:
        return "Rarely"
      case 2:
        return "Sometimes"
      case 3:
        return "Often"
      case 4:
        return "Daily"
      default:
        return "Never"
    }
  }

  const improvingSymptoms = symptomData.filter((s) => s.trend === "improving").length
  const totalSymptoms = symptomData.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Symptom Tracking</h3>
          <p className="text-sm text-muted-foreground">Monitor your symptoms and their progression over time</p>
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
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Add Symptom
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{improvingSymptoms}</p>
                <p className="text-sm text-muted-foreground">Improving</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSymptoms}</p>
                <p className="text-sm text-muted-foreground">Total Tracked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">65%</p>
                <p className="text-sm text-muted-foreground">Avg Reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2.1</p>
                <p className="text-sm text-muted-foreground">Avg Severity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Symptom Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Symptom Trends Over Time</CardTitle>
          <CardDescription>Track how your symptoms are changing with treatment</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="fatigue" stroke="#dc2626" strokeWidth={2} name="Fatigue" />
              <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} name="Stress" />
              <Line type="monotone" dataKey="digestive" stroke="#10b981" strokeWidth={2} name="Digestive Issues" />
              <Line type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={2} name="Sleep Problems" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Current Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle>Current Symptoms</CardTitle>
          <CardDescription>Your actively tracked symptoms and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {symptomData.map((symptom, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{symptom.symptom}</h4>
                    <Badge className={getCategoryColor(symptom.category)} variant="secondary">
                      {symptom.category}
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(symptom.trend)}`}>
                    {getTrendIcon(symptom.trend)}
                    <span className="text-sm font-medium">{symptom.trend}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Severity</span>
                      <span>{getSeverityLabel(symptom.severity)}</span>
                    </div>
                    <Progress value={(symptom.severity / 3) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Frequency</span>
                      <span>{getFrequencyLabel(symptom.frequency)}</span>
                    </div>
                    <Progress value={(symptom.frequency / 4) * 100} className="h-2" />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Last Reported</p>
                      <p className="text-sm font-medium">{new Date(symptom.lastReported).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

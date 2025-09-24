"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Heart, Brain, Zap, Shield } from "lucide-react"

interface WellnessMetric {
  id: string
  name: string
  category: "physical" | "mental" | "emotional" | "spiritual"
  currentValue: number
  previousValue: number
  targetValue: number
  unit: string
  trend: "up" | "down" | "stable"
  description: string
  icon: React.ReactNode
}

export function WellnessMetrics() {
  const metrics: WellnessMetric[] = [
    {
      id: "1",
      name: "Energy Level",
      category: "physical",
      currentValue: 78,
      previousValue: 65,
      targetValue: 85,
      unit: "%",
      trend: "up",
      description: "Overall energy and vitality throughout the day",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "2",
      name: "Sleep Quality",
      category: "physical",
      currentValue: 82,
      previousValue: 70,
      targetValue: 90,
      unit: "%",
      trend: "up",
      description: "Quality and restfulness of sleep",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      id: "3",
      name: "Stress Level",
      category: "mental",
      currentValue: 35,
      previousValue: 55,
      targetValue: 20,
      unit: "%",
      trend: "down",
      description: "Perceived stress and anxiety levels",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      id: "4",
      name: "Digestive Health",
      category: "physical",
      currentValue: 75,
      previousValue: 60,
      targetValue: 85,
      unit: "%",
      trend: "up",
      description: "Digestive comfort and regularity",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "5",
      name: "Mental Clarity",
      category: "mental",
      currentValue: 80,
      previousValue: 75,
      targetValue: 90,
      unit: "%",
      trend: "up",
      description: "Focus, concentration, and mental sharpness",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      id: "6",
      name: "Emotional Balance",
      category: "emotional",
      currentValue: 72,
      previousValue: 68,
      targetValue: 85,
      unit: "%",
      trend: "up",
      description: "Emotional stability and mood regulation",
      icon: <Heart className="h-5 w-5" />,
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string, isStressMetric = false) => {
    if (isStressMetric) {
      // For stress, down is good, up is bad
      switch (trend) {
        case "down":
          return "text-green-600"
        case "up":
          return "text-red-600"
        default:
          return "text-gray-600"
      }
    } else {
      // For other metrics, up is good, down is bad
      switch (trend) {
        case "up":
          return "text-green-600"
        case "down":
          return "text-red-600"
        default:
          return "text-gray-600"
      }
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "physical":
        return "bg-blue-100 text-blue-800"
      case "mental":
        return "bg-purple-100 text-purple-800"
      case "emotional":
        return "bg-pink-100 text-pink-800"
      case "spiritual":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateChange = (current: number, previous: number) => {
    const change = current - previous
    const percentage = Math.abs((change / previous) * 100)
    return { change, percentage: Math.round(percentage) }
  }

  const averageWellness = Math.round(metrics.reduce((sum, metric) => sum + metric.currentValue, 0) / metrics.length)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Wellness Overview
          </CardTitle>
          <CardDescription>Your current wellness metrics and progress trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{averageWellness}%</div>
            <p className="text-muted-foreground">Overall Wellness Score</p>
            <Progress value={averageWellness} className="h-3 mt-4" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const { change, percentage } = calculateChange(metric.currentValue, metric.previousValue)
          const isStressMetric = metric.name.toLowerCase().includes("stress")

          return (
            <Card key={metric.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">{metric.icon}</div>
                    <div>
                      <h4 className="font-semibold">{metric.name}</h4>
                      <Badge className={getCategoryColor(metric.category)} variant="secondary">
                        {metric.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {metric.currentValue}
                      {metric.unit}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.trend, isStressMetric)}`}>
                      {getTrendIcon(metric.trend)}
                      {percentage}% from last month
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress to Target</span>
                      <span>
                        {metric.currentValue}/{metric.targetValue}
                        {metric.unit}
                      </span>
                    </div>
                    <Progress value={(metric.currentValue / metric.targetValue) * 100} className="h-2" />
                  </div>

                  <p className="text-sm text-muted-foreground">{metric.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Previous: {metric.previousValue}
                      {metric.unit}
                    </span>
                    <span>
                      Target: {metric.targetValue}
                      {metric.unit}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wellness Insights</CardTitle>
          <CardDescription>AI-powered insights based on your progress data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Positive Trends</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Your energy levels have improved by 20% since starting treatment</li>
              <li>• Sleep quality shows consistent improvement over the past month</li>
              <li>• Stress levels are decreasing, indicating better stress management</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Continue current Abhyanga sessions to maintain energy improvements</li>
              <li>• Consider adding meditation practice to further reduce stress levels</li>
              <li>• Focus on digestive health through dietary modifications</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">Areas for Focus</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Emotional balance could benefit from additional support practices</li>
              <li>• Consider lifestyle adjustments to reach optimal digestive health</li>
              <li>• Mental clarity is improving but has room for further enhancement</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

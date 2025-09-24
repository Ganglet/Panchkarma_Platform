"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Target, Calendar, Award } from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string
  category: "health" | "therapy" | "wellness" | "lifestyle"
  targetDate: string
  completedDate?: string
  progress: number
  isCompleted: boolean
  requirements: string[]
  rewards: string[]
}

export function MilestoneTracker() {
  const milestones: Milestone[] = [
    {
      id: "1",
      title: "Complete Panchakarma Preparation Phase",
      description: "Successfully complete all preparatory treatments before main detox",
      category: "therapy",
      targetDate: "2024-01-20",
      completedDate: "2024-01-18",
      progress: 100,
      isCompleted: true,
      requirements: ["Complete 5 Abhyanga sessions", "Follow pre-detox diet", "Complete consultation"],
      rewards: ["Ready for main detox phase", "Improved circulation", "Better sleep quality"],
    },
    {
      id: "2",
      title: "Achieve 50% Symptom Reduction",
      description: "Reduce primary symptoms by at least 50% from baseline",
      category: "health",
      targetDate: "2024-02-01",
      progress: 75,
      isCompleted: false,
      requirements: ["Complete 15 therapy sessions", "Maintain treatment schedule", "Follow dietary guidelines"],
      rewards: ["Significant health improvement", "Increased energy levels", "Better quality of life"],
    },
    {
      id: "3",
      title: "Master Daily Wellness Routine",
      description: "Establish and maintain daily Ayurvedic wellness practices",
      category: "lifestyle",
      targetDate: "2024-01-30",
      progress: 60,
      isCompleted: false,
      requirements: [
        "Daily meditation (20 min)",
        "Follow Ayurvedic diet",
        "Regular sleep schedule",
        "Daily yoga practice",
      ],
      rewards: ["Sustainable wellness habits", "Improved mental clarity", "Better stress management"],
    },
    {
      id: "4",
      title: "Complete Full Detox Program",
      description: "Successfully complete the entire 21-day Panchakarma program",
      category: "therapy",
      targetDate: "2024-02-15",
      progress: 57,
      isCompleted: false,
      requirements: ["Complete all 21 sessions", "Follow post-treatment care", "Maintain dietary restrictions"],
      rewards: ["Complete detoxification", "Renewed vitality", "Balanced doshas"],
    },
    {
      id: "5",
      title: "Achieve Optimal Wellness Score",
      description: "Reach and maintain a wellness score of 90 or above",
      category: "wellness",
      targetDate: "2024-03-01",
      progress: 30,
      isCompleted: false,
      requirements: ["Consistent therapy attendance", "Lifestyle modifications", "Regular progress assessments"],
      rewards: ["Optimal health status", "Long-term wellness", "Preventive health benefits"],
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "bg-red-100 text-red-800"
      case "therapy":
        return "bg-blue-100 text-blue-800"
      case "wellness":
        return "bg-green-100 text-green-800"
      case "lifestyle":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health":
        return <Target className="h-4 w-4" />
      case "therapy":
        return <Calendar className="h-4 w-4" />
      case "wellness":
        return <Award className="h-4 w-4" />
      case "lifestyle":
        return <Circle className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const completedMilestones = milestones.filter((m) => m.isCompleted).length
  const totalMilestones = milestones.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Recovery Milestones
          </CardTitle>
          <CardDescription>
            Track your progress through personalized recovery milestones ({completedMilestones}/{totalMilestones}{" "}
            completed)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Milestone Progress</span>
              <span>{Math.round((completedMilestones / totalMilestones) * 100)}%</span>
            </div>
            <Progress value={(completedMilestones / totalMilestones) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className={milestone.isCompleted ? "border-green-200 bg-green-50/50" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {milestone.isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-semibold ${milestone.isCompleted ? "text-green-800" : ""}`}>
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getCategoryColor(milestone.category)}>
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(milestone.category)}
                            {milestone.category}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Target: {new Date(milestone.targetDate).toLocaleDateString()}
                        </Badge>
                        {milestone.completedDate && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{milestone.progress}%</p>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>

                  {!milestone.isCompleted && (
                    <div>
                      <Progress value={milestone.progress} className="h-2 mb-4" />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2 text-sm">Requirements</h5>
                      <ul className="space-y-1">
                        {milestone.requirements.map((req, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-muted-foreground mt-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2 text-sm">Benefits</h5>
                      <ul className="space-y-1">
                        {milestone.rewards.map((reward, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>{reward}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

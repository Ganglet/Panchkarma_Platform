"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Save, FileText } from "lucide-react"

interface TherapyTemplate {
  id: string
  name: string
  duration: string
  sessions: number
  description: string
  conditions: string[]
}

const therapyTemplates: TherapyTemplate[] = [
  {
    id: "1",
    name: "Abhyanga + Swedana",
    duration: "90 minutes",
    sessions: 7,
    description: "Oil massage followed by herbal steam therapy",
    conditions: ["Stress", "Joint Pain", "Circulation"],
  },
  {
    id: "2",
    name: "Shirodhara",
    duration: "60 minutes",
    sessions: 5,
    description: "Continuous oil pouring on forehead",
    conditions: ["Anxiety", "Insomnia", "Mental Stress"],
  },
  {
    id: "3",
    name: "Panchakarma Detox",
    duration: "21 days",
    sessions: 21,
    description: "Complete detoxification program",
    conditions: ["Chronic Diseases", "Toxin Buildup", "Digestive Issues"],
  },
]

export function TherapyPlanner() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [customPlan, setCustomPlan] = useState({
    patientName: "",
    condition: "",
    duration: "",
    frequency: "",
    notes: "",
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Therapy Planner</h2>
        <p className="text-gray-600">Create and customize therapy programs for your patients</p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Therapy Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Plan</TabsTrigger>
          <TabsTrigger value="protocols">Treatment Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {therapyTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {template.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {template.sessions} sessions
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.conditions.map((condition) => (
                        <Badge key={condition} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Therapy Plan</CardTitle>
              <CardDescription>Design a personalized treatment program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient Name</Label>
                  <Input
                    id="patient"
                    placeholder="Select or enter patient name"
                    value={customPlan.patientName}
                    onChange={(e) => setCustomPlan({ ...customPlan, patientName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Primary Condition</Label>
                  <Select
                    value={customPlan.condition}
                    onValueChange={(value) => setCustomPlan({ ...customPlan, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stress">Stress & Anxiety</SelectItem>
                      <SelectItem value="digestive">Digestive Issues</SelectItem>
                      <SelectItem value="joint">Joint Pain</SelectItem>
                      <SelectItem value="skin">Skin Disorders</SelectItem>
                      <SelectItem value="chronic">Chronic Fatigue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Treatment Duration</Label>
                  <Select
                    value={customPlan.duration}
                    onValueChange={(value) => setCustomPlan({ ...customPlan, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="21">21 days</SelectItem>
                      <SelectItem value="28">28 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Session Frequency</Label>
                  <Select
                    value={customPlan.frequency}
                    onValueChange={(value) => setCustomPlan({ ...customPlan, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="alternate">Alternate days</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Treatment Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add specific instructions, precautions, or modifications..."
                  value={customPlan.notes}
                  onChange={(e) => setCustomPlan({ ...customPlan, notes: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Plan
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Protocol
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Protocols</CardTitle>
              <CardDescription>Standardized protocols for common conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { condition: "Stress Management", protocol: "Shirodhara + Abhyanga", duration: "14 days" },
                  { condition: "Digestive Health", protocol: "Virechana + Basti", duration: "21 days" },
                  { condition: "Joint Pain Relief", protocol: "Abhyanga + Swedana + Basti", duration: "28 days" },
                  { condition: "Skin Purification", protocol: "Udvartana + Virechana", duration: "14 days" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.condition}</h4>
                      <p className="text-sm text-gray-600">{item.protocol}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.duration}</Badge>
                      <Button variant="outline" size="sm">
                        Use Protocol
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

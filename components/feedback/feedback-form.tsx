"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, X } from "lucide-react"

interface FeedbackFormProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string | null
}

export function FeedbackForm({ isOpen, onClose, sessionId }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    rating: 0,
    overallFeeling: "",
    symptoms: [] as string[],
    improvements: [] as string[],
    sideEffects: [] as string[],
    notes: "",
    followUpNeeded: false,
    recommendTreatment: "",
  })

  const [customSymptom, setCustomSymptom] = useState("")
  const [customImprovement, setCustomImprovement] = useState("")
  const [customSideEffect, setCustomSideEffect] = useState("")

  const commonSymptoms = [
    "headache",
    "fatigue",
    "nausea",
    "dizziness",
    "muscle tension",
    "digestive issues",
    "sleep problems",
    "anxiety",
    "stress",
    "pain",
  ]

  const commonImprovements = [
    "better sleep",
    "increased energy",
    "reduced pain",
    "improved mood",
    "better digestion",
    "reduced stress",
    "clearer skin",
    "mental clarity",
    "improved circulation",
    "better appetite",
  ]

  const commonSideEffects = [
    "mild nausea",
    "temporary fatigue",
    "skin sensitivity",
    "mild headache",
    "drowsiness",
    "temporary discomfort",
    "mild dizziness",
  ]

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating })
  }

  const toggleItem = (item: string, category: "symptoms" | "improvements" | "sideEffects") => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].includes(item) ? prev[category].filter((i) => i !== item) : [...prev[category], item],
    }))
  }

  const addCustomItem = (item: string, category: "symptoms" | "improvements" | "sideEffects") => {
    if (item.trim() && !formData[category].includes(item.trim())) {
      setFormData((prev) => ({
        ...prev,
        [category]: [...prev[category], item.trim()],
      }))
    }
  }

  const removeItem = (item: string, category: "symptoms" | "improvements" | "sideEffects") => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].filter((i) => i !== item),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Feedback submitted:", formData)
    // Handle form submission
    onClose()
    // Reset form
    setFormData({
      rating: 0,
      overallFeeling: "",
      symptoms: [],
      improvements: [],
      sideEffects: [],
      notes: "",
      followUpNeeded: false,
      recommendTreatment: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Session Feedback</DialogTitle>
          <DialogDescription>Help us improve your treatment by sharing your experience</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <Label>Overall Session Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => handleRatingClick(star)} className="focus:outline-none">
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= formData.rating
                        ? "fill-secondary text-secondary"
                        : "text-muted-foreground hover:text-secondary"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating > 0 && `${formData.rating}/5`}
              </span>
            </div>
          </div>

          {/* Overall Feeling */}
          <div className="space-y-3">
            <Label>How do you feel overall after this session?</Label>
            <RadioGroup
              value={formData.overallFeeling}
              onValueChange={(value) => setFormData({ ...formData, overallFeeling: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="much better" id="much-better" />
                <Label htmlFor="much-better">Much better</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="better" id="better" />
                <Label htmlFor="better">Better</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="same" id="same" />
                <Label htmlFor="same">About the same</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="worse" id="worse" />
                <Label htmlFor="worse">Worse</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Symptoms */}
          <div className="space-y-3">
            <Label>Any symptoms or discomfort experienced?</Label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => (
                  <Badge
                    key={symptom}
                    variant={formData.symptoms.includes(symptom) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleItem(symptom, "symptoms")}
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom symptom..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addCustomItem(customSymptom, "symptoms")
                      setCustomSymptom("")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addCustomItem(customSymptom, "symptoms")
                    setCustomSymptom("")
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.symptoms.map((symptom) => (
                    <Badge key={symptom} variant="destructive" className="cursor-pointer">
                      {symptom}
                      <X className="h-3 w-3 ml-1" onClick={() => removeItem(symptom, "symptoms")} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Improvements */}
          <div className="space-y-3">
            <Label>What improvements did you notice?</Label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {commonImprovements.map((improvement) => (
                  <Badge
                    key={improvement}
                    variant={formData.improvements.includes(improvement) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleItem(improvement, "improvements")}
                  >
                    {improvement}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom improvement..."
                  value={customImprovement}
                  onChange={(e) => setCustomImprovement(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addCustomItem(customImprovement, "improvements")
                      setCustomImprovement("")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addCustomItem(customImprovement, "improvements")
                    setCustomImprovement("")
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.improvements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.improvements.map((improvement) => (
                    <Badge key={improvement} variant="secondary" className="cursor-pointer">
                      {improvement}
                      <X className="h-3 w-3 ml-1" onClick={() => removeItem(improvement, "improvements")} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side Effects */}
          <div className="space-y-3">
            <Label>Any side effects or unexpected reactions?</Label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {commonSideEffects.map((sideEffect) => (
                  <Badge
                    key={sideEffect}
                    variant={formData.sideEffects.includes(sideEffect) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleItem(sideEffect, "sideEffects")}
                  >
                    {sideEffect}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom side effect..."
                  value={customSideEffect}
                  onChange={(e) => setCustomSideEffect(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addCustomItem(customSideEffect, "sideEffects")
                      setCustomSideEffect("")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addCustomItem(customSideEffect, "sideEffects")
                    setCustomSideEffect("")
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.sideEffects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.sideEffects.map((sideEffect) => (
                    <Badge key={sideEffect} variant="outline" className="cursor-pointer bg-amber-50 text-amber-700">
                      {sideEffect}
                      <X className="h-3 w-3 ml-1" onClick={() => removeItem(sideEffect, "sideEffects")} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Share any other thoughts, concerns, or observations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          {/* Follow-up */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="follow-up"
              checked={formData.followUpNeeded}
              onCheckedChange={(checked) => setFormData({ ...formData, followUpNeeded: !!checked })}
            />
            <Label htmlFor="follow-up">I would like a follow-up consultation about this session</Label>
          </div>

          {/* Recommendation */}
          <div className="space-y-3">
            <Label>Would you recommend this treatment to others?</Label>
            <RadioGroup
              value={formData.recommendTreatment}
              onValueChange={(value) => setFormData({ ...formData, recommendTreatment: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="definitely" id="definitely" />
                <Label htmlFor="definitely">Definitely</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="probably" id="probably" />
                <Label htmlFor="probably">Probably</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maybe" id="maybe" />
                <Label htmlFor="maybe">Maybe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="probably-not" id="probably-not" />
                <Label htmlFor="probably-not">Probably not</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Feedback</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

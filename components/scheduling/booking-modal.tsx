"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  userType: "patient" | "practitioner"
}

export function BookingModal({ isOpen, onClose, userType }: BookingModalProps) {
  const [formData, setFormData] = useState({
    therapy: "",
    date: "",
    time: "",
    practitioner: "",
    patient: "",
    notes: "",
  })

  const therapyTypes = [
    "Abhyanga (Oil Massage)",
    "Shirodhara (Oil Pouring)",
    "Panchakarma Detox",
    "Nasya (Nasal Therapy)",
    "Basti (Enema Therapy)",
    "Udvartana (Powder Massage)",
    "Consultation",
  ]

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  const practitioners = ["Dr. Priya Sharma", "Dr. Raj Patel", "Dr. Meera Gupta", "Dr. Arjun Singh"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    console.log("Booking submitted:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {userType === "patient" ? "Book New Appointment" : "Schedule Appointment"}
          </DialogTitle>
          <DialogDescription>
            {userType === "patient" ? "Schedule your next therapy session" : "Add a new appointment to the schedule"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="therapy">Therapy Type</Label>
              <Select value={formData.therapy} onValueChange={(value) => setFormData({ ...formData, therapy: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select therapy" />
                </SelectTrigger>
                <SelectContent>
                  {therapyTypes.map((therapy) => (
                    <SelectItem key={therapy} value={therapy}>
                      {therapy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="practitioner">{userType === "patient" ? "Practitioner" : "Patient"}</Label>
              {userType === "patient" ? (
                <Select
                  value={formData.practitioner}
                  onValueChange={(value) => setFormData({ ...formData, practitioner: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select practitioner" />
                  </SelectTrigger>
                  <SelectContent>
                    {practitioners.map((practitioner) => (
                      <SelectItem key={practitioner} value={practitioner}>
                        {practitioner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Patient name"
                  value={formData.patient}
                  onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                  required
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{userType === "patient" ? "Book Appointment" : "Schedule Appointment"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

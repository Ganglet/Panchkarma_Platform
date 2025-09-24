"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Clock, Mail, MessageSquare, Smartphone, AlertTriangle, CheckCircle, Calendar, User } from "lucide-react"
import { toast } from "sonner"

interface ProcedureAlert {
  id: string
  patientName: string
  therapy: string
  appointmentDate: string
  type: 'pre_procedure' | 'post_procedure'
  status: 'scheduled' | 'sent' | 'delivered' | 'read'
  channels: ('email' | 'sms' | 'in_app')[]
  message: string
  scheduledFor: string
}

export function ProcedureAlerts() {
  const [alerts, setAlerts] = useState<ProcedureAlert[]>([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      therapy: 'Abhyanga',
      appointmentDate: '2024-01-15T10:00:00Z',
      type: 'pre_procedure',
      status: 'scheduled',
      channels: ['email', 'sms'],
      message: 'Your Abhyanga session is scheduled for tomorrow at 10:00 AM. Please avoid heavy meals 2 hours before and drink plenty of water.',
      scheduledFor: '2024-01-14T18:00:00Z'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      therapy: 'Shirodhara',
      appointmentDate: '2024-01-15T14:00:00Z',
      type: 'post_procedure',
      status: 'sent',
      channels: ['email', 'in_app'],
      message: 'Your Shirodhara session is complete. Please rest for 1 hour and avoid screens for 2 hours. Follow the prescribed diet.',
      scheduledFor: '2024-01-15T15:30:00Z'
    }
  ])

  const [newAlert, setNewAlert] = useState({
    patientName: '',
    therapy: '',
    appointmentDate: '',
    type: 'pre_procedure' as 'pre_procedure' | 'post_procedure',
    channels: [] as ('email' | 'sms' | 'in_app')[],
    message: '',
    scheduledFor: ''
  })

  const therapies = [
    'Abhyanga',
    'Shirodhara', 
    'Basti',
    'Panchakarma Consultation',
    'Nasya',
    'Virechana'
  ]

  const patients = [
    'Sarah Johnson',
    'Michael Chen',
    'Emma Wilson',
    'David Kumar',
    'Priya Sharma'
  ]

  const preProcedureTemplates = {
    'Abhyanga': 'Your Abhyanga session is scheduled for {date} at {time}. Please avoid heavy meals 2 hours before and drink plenty of water.',
    'Shirodhara': 'Your Shirodhara session is scheduled for {date} at {time}. Please have a light meal 1 hour before and empty your bladder.',
    'Basti': 'Your Basti session is scheduled for {date} at {time}. Please follow a light diet the day before and empty bowels in the morning.',
    'Panchakarma Consultation': 'Your Panchakarma consultation is scheduled for {date} at {time}. Please bring your medical history and fast for 2 hours before.',
    'Nasya': 'Your Nasya session is scheduled for {date} at {time}. Please come on an empty stomach and clean your nasal passages.',
    'Virechana': 'Your Virechana session is scheduled for {date} at {time}. Please follow a light diet for 3 days and stay hydrated.'
  }

  const postProcedureTemplates = {
    'Abhyanga': 'Your Abhyanga session is complete. Please rest for 30 minutes and avoid cold water for 2 hours.',
    'Shirodhara': 'Your Shirodhara session is complete. Please rest for 1 hour and avoid screens for 2 hours.',
    'Basti': 'Your Basti session is complete. Please rest for 2 hours and follow the prescribed diet.',
    'Panchakarma Consultation': 'Your consultation is complete. Please follow the treatment plan and schedule your next appointment.',
    'Nasya': 'Your Nasya session is complete. Please avoid cold foods and rest for 30 minutes.',
    'Virechana': 'Your Virechana session is complete. Please rest for 24 hours and follow the prescribed diet for 1 week.'
  }

  const handleCreateAlert = () => {
    if (!newAlert.patientName || !newAlert.therapy || !newAlert.appointmentDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const template = newAlert.type === 'pre_procedure' 
      ? preProcedureTemplates[newAlert.therapy as keyof typeof preProcedureTemplates]
      : postProcedureTemplates[newAlert.therapy as keyof typeof postProcedureTemplates]

    const alert: ProcedureAlert = {
      id: Date.now().toString(),
      patientName: newAlert.patientName,
      therapy: newAlert.therapy,
      appointmentDate: newAlert.appointmentDate,
      type: newAlert.type,
      status: 'scheduled',
      channels: newAlert.channels,
      message: newAlert.message || template,
      scheduledFor: newAlert.scheduledFor
    }

    setAlerts([...alerts, alert])
    setNewAlert({
      patientName: '',
      therapy: '',
      appointmentDate: '',
      type: 'pre_procedure',
      channels: [],
      message: '',
      scheduledFor: ''
    })
    toast.success('Alert scheduled successfully')
  }

  const handleChannelToggle = (channel: 'email' | 'sms' | 'in_app') => {
    setNewAlert(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'read': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'pre_procedure' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Procedure Alerts & Notifications</h2>
          <p className="text-muted-foreground">Automated pre and post-procedure patient notifications</p>
        </div>
        <Button>
          <Bell className="h-4 w-4 mr-2" />
          Send Bulk Alert
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="create">Create Alert</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{alert.patientName}</h4>
                          <Badge variant="outline">{alert.therapy}</Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(alert.appointmentDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.scheduledFor).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            {alert.channels.map((channel) => (
                              <span key={channel} className="flex items-center gap-1">
                                {channel === 'email' && <Mail className="h-3 w-3" />}
                                {channel === 'sms' && <Smartphone className="h-3 w-3" />}
                                {channel === 'in_app' && <MessageSquare className="h-3 w-3" />}
                                {channel}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Resend</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Alert</CardTitle>
              <CardDescription>Schedule automated notifications for patients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select value={newAlert.patientName} onValueChange={(value) => setNewAlert(prev => ({ ...prev, patientName: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient} value={patient}>{patient}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapy">Therapy</Label>
                  <Select value={newAlert.therapy} onValueChange={(value) => setNewAlert(prev => ({ ...prev, therapy: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select therapy" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapies.map((therapy) => (
                        <SelectItem key={therapy} value={therapy}>{therapy}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Appointment Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={newAlert.appointmentDate}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, appointmentDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Alert Type</Label>
                  <Select value={newAlert.type} onValueChange={(value: 'pre_procedure' | 'post_procedure') => setNewAlert(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre_procedure">Pre-Procedure</SelectItem>
                      <SelectItem value="post_procedure">Post-Procedure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notification Channels</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newAlert.channels.includes('email')}
                      onChange={() => handleChannelToggle('email')}
                    />
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newAlert.channels.includes('sms')}
                      onChange={() => handleChannelToggle('sms')}
                    />
                    <Smartphone className="h-4 w-4" />
                    SMS
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newAlert.channels.includes('in_app')}
                      onChange={() => handleChannelToggle('in_app')}
                    />
                    <MessageSquare className="h-4 w-4" />
                    In-App
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Textarea
                  placeholder="Leave empty to use template message"
                  value={newAlert.message}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledFor">Schedule Alert For</Label>
                <Input
                  type="datetime-local"
                  value={newAlert.scheduledFor}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, scheduledFor: e.target.value }))}
                />
              </div>

              <Button onClick={handleCreateAlert} className="w-full">
                Schedule Alert
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Procedure Templates</CardTitle>
                <CardDescription>Automated messages sent before therapy sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(preProcedureTemplates).map(([therapy, template]) => (
                    <div key={therapy} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{therapy}</h4>
                      <p className="text-sm text-muted-foreground">{template}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Post-Procedure Templates</CardTitle>
                <CardDescription>Follow-up messages sent after therapy sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(postProcedureTemplates).map(([therapy, template]) => (
                    <div key={therapy} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{therapy}</h4>
                      <p className="text-sm text-muted-foreground">{template}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
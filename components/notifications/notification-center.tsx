"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Clock, AlertTriangle, CheckCircle, Settings, Mail, Smartphone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { NotificationServiceClient } from "@/lib/notification-service-client"
import { isSupabaseReady } from "@/lib/supabase"
import { useEffect } from "react"

interface Notification {
  id: string
  type: "reminder" | "alert" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
  category: "pre-procedure" | "post-procedure" | "appointment" | "general"
  therapy?: string
}

export function NotificationCenter() {
  const { profile } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications when component mounts
  useEffect(() => {
    if (profile && isSupabaseReady) {
      loadNotifications()
    }
  }, [profile])

  const loadNotifications = async () => {
    if (!profile) return
    
    try {
      console.log('Loading notifications from Supabase for user:', profile.id)
      const data = await NotificationServiceClient.getNotifications(profile.id)
      console.log('Loaded notifications:', data)
      
      // Convert Supabase notifications to component format
      const formattedNotifications = data.map(notification => ({
        id: notification.id,
        type: notification.type as "reminder" | "alert" | "info" | "success",
        title: notification.title,
        message: notification.message,
        timestamp: notification.created_at,
        read: notification.read,
        category: notification.category as "pre-procedure" | "post-procedure" | "appointment" | "general",
        therapy: notification.therapy_id
      }))
      
      setNotifications(formattedNotifications)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    inApp: true,
    preProcedure: true,
    postProcedure: true,
    appointments: true,
    reminders: true,
    timing: "2", // hours before
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Clock className="h-5 w-5 text-secondary" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-primary" />
    }
  }

  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case "reminder":
        return "secondary"
      case "alert":
        return "destructive"
      case "success":
        return "default"
      default:
        return "outline"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All notifications read"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? "border-primary/50 bg-primary/5" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4
                            className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.title}
                          </h4>
                          {notification.therapy && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {notification.therapy}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getNotificationBadgeVariant(notification.type)} className="text-xs">
                            {notification.type}
                          </Badge>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up! New notifications will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Customize how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Channels */}
              <div className="space-y-4">
                <h4 className="font-semibold">Notification Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, email: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                      </div>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, sms: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">Show notifications within the app</p>
                      </div>
                    </div>
                    <Switch
                      id="in-app-notifications"
                      checked={notificationSettings.inApp}
                      onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, inApp: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-4">
                <h4 className="font-semibold">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pre-procedure">Pre-Procedure Reminders</Label>
                      <p className="text-sm text-muted-foreground">Preparation instructions before therapy</p>
                    </div>
                    <Switch
                      id="pre-procedure"
                      checked={notificationSettings.preProcedure}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, preProcedure: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="post-procedure">Post-Procedure Care</Label>
                      <p className="text-sm text-muted-foreground">Care instructions after therapy</p>
                    </div>
                    <Switch
                      id="post-procedure"
                      checked={notificationSettings.postProcedure}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, postProcedure: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appointments">Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Upcoming session reminders</p>
                    </div>
                    <Switch
                      id="appointments"
                      checked={notificationSettings.appointments}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, appointments: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Timing Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold">Reminder Timing</h4>
                <div className="space-y-2">
                  <Label htmlFor="reminder-timing">Send reminders before appointments</Label>
                  <Select
                    value={notificationSettings.timing}
                    onValueChange={(value) => setNotificationSettings((prev) => ({ ...prev, timing: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">30 minutes before</SelectItem>
                      <SelectItem value="1">1 hour before</SelectItem>
                      <SelectItem value="2">2 hours before</SelectItem>
                      <SelectItem value="4">4 hours before</SelectItem>
                      <SelectItem value="24">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

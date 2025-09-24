"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

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

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "alert" ? "destructive" : "default",
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  // Simulate automated notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // This would be replaced with actual API calls in a real app
      const mockNotifications = [
        {
          type: "reminder" as const,
          title: "Pre-Procedure Reminder",
          message: "Please avoid heavy meals 2 hours before your upcoming session",
          category: "pre-procedure" as const,
          therapy: "Abhyanga",
        },
        {
          type: "info" as const,
          title: "Post-Procedure Care",
          message: "Remember to drink warm water and rest after your session",
          category: "post-procedure" as const,
          therapy: "Shirodhara",
        },
      ]

      // Randomly add a notification (simulate real-time updates)
      if (Math.random() > 0.8) {
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
        addNotification(randomNotification)
      }
    }, 30000) // Every 30 seconds for demo purposes

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

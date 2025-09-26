"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  Bell, 
  Settings,
  Edit,
  Save,
  X,
  Camera
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { profile, user } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || '',
    gender: profile?.gender || '',
    address: profile?.address || ''
  })

  const handleSave = () => {
    // In a real app, this would save to the database
    console.log('Saving profile:', editedProfile)
    setIsEditing(false)
    // Show success message
  }

  const handleCancel = () => {
    setEditedProfile({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      date_of_birth: profile?.date_of_birth || '',
      gender: profile?.gender || '',
      address: profile?.address || ''
    })
    setIsEditing(false)
  }

  const getInitials = () => {
    if (!profile) return 'U'
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()
  }

  const getUserTypeColor = () => {
    switch (profile?.user_type) {
      case 'patient': return 'bg-emerald-100 text-emerald-800'
      case 'practitioner': return 'bg-blue-100 text-blue-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUserTypeIcon = () => {
    switch (profile?.user_type) {
      case 'patient': return '👤'
      case 'practitioner': return '👨‍⚕️'
      case 'admin': return '🛡️'
      default: return '👤'
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Profile</h1>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
            >
              <X className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                      <AvatarFallback className="text-2xl">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">
                    {profile.first_name} {profile.last_name}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <span className="text-lg">{getUserTypeIcon()}</span>
                    <Badge className={getUserTypeColor()}>
                      {profile.user_type?.charAt(0).toUpperCase() + profile.user_type?.slice(1)}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  {profile.date_of_birth && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Born {new Date(profile.date_of_birth).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {profile.gender && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm capitalize">{profile.gender}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="personal">Personal Information</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Personal Information</CardTitle>
                          <CardDescription>Update your personal details</CardDescription>
                        </div>
                        {!isEditing ? (
                          <Button onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button onClick={handleSave}>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="outline" onClick={handleCancel}>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={editedProfile.first_name}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, first_name: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={editedProfile.last_name}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, last_name: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={editedProfile.date_of_birth}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Input
                            id="gender"
                            value={editedProfile.gender}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, gender: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={editedProfile.address}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Bell className="h-4 w-4" />
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                            </div>
                          </div>
                          <Badge variant={profile.notification_preferences?.email ? "default" : "secondary"}>
                            {profile.notification_preferences?.email ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4" />
                            <div>
                              <p className="font-medium">SMS Notifications</p>
                              <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                            </div>
                          </div>
                          <Badge variant={profile.notification_preferences?.sms ? "default" : "secondary"}>
                            {profile.notification_preferences?.sms ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Bell className="h-4 w-4" />
                            <div>
                              <p className="font-medium">In-App Notifications</p>
                              <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
                            </div>
                          </div>
                          <Badge variant={profile.notification_preferences?.in_app ? "default" : "secondary"}>
                            {profile.notification_preferences?.in_app ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4" />
                            <div>
                              <p className="font-medium">Change Password</p>
                              <p className="text-sm text-muted-foreground">Update your account password</p>
                            </div>
                          </div>
                          <Button variant="outline">Change</Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Settings className="h-4 w-4" />
                            <div>
                              <p className="font-medium">Two-Factor Authentication</p>
                              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                            </div>
                          </div>
                          <Button variant="outline">Enable</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

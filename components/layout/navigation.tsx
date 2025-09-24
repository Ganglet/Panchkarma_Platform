"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Calendar, TrendingUp, MessageSquare, Bell, Settings, LogOut, Menu, X } from "lucide-react"

interface NavigationProps {
  userType: "patient" | "practitioner"
}

export function Navigation({ userType }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const patientNavItems = [
    { href: "/patient/dashboard", label: "Dashboard", icon: Home },
    { href: "/patient/appointments", label: "Appointments", icon: Calendar },
    { href: "/patient/progress", label: "Progress", icon: TrendingUp },
    { href: "/patient/feedback", label: "Feedback", icon: MessageSquare },
  ]

  const practitionerNavItems = [
    { href: "/practitioner/dashboard", label: "Dashboard", icon: Home },
    { href: "/practitioner/patients", label: "Patients", icon: Calendar },
    { href: "/practitioner/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/practitioner/settings", label: "Settings", icon: Settings },
  ]

  const navItems = userType === "patient" ? patientNavItems : practitionerNavItems

  return (
    <nav className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-primary">Panchakarma</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

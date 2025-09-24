"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, Calendar, Star } from "lucide-react"

const monthlyData = [
  { month: "Jan", patients: 45, sessions: 180, revenue: 25000 },
  { month: "Feb", patients: 52, sessions: 208, revenue: 28000 },
  { month: "Mar", patients: 48, sessions: 192, revenue: 26500 },
  { month: "Apr", patients: 58, sessions: 232, revenue: 32000 },
  { month: "May", patients: 65, sessions: 260, revenue: 35000 },
  { month: "Jun", patients: 72, sessions: 288, revenue: 38000 },
]

const therapyDistribution = [
  { name: "Abhyanga", value: 35, color: "#dc2626" },
  { name: "Shirodhara", value: 25, color: "#ea580c" },
  { name: "Panchakarma", value: 20, color: "#d97706" },
  { name: "Swedana", value: 15, color: "#ca8a04" },
  { name: "Others", value: 5, color: "#65a30d" },
]

const patientOutcomes = [
  { condition: "Stress & Anxiety", improved: 85, maintained: 12, declined: 3 },
  { condition: "Digestive Issues", improved: 78, maintained: 18, declined: 4 },
  { condition: "Joint Pain", improved: 82, maintained: 15, declined: 3 },
  { condition: "Skin Disorders", improved: 90, maintained: 8, declined: 2 },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Track your practice performance and patient outcomes</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">288</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">Patient improvement rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Patient count and session volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="#dc2626" strokeWidth={2} />
                <Line type="monotone" dataKey="sessions" stroke="#ea580c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Therapy Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Therapy Distribution</CardTitle>
            <CardDescription>Most popular treatments this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={therapyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {therapyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {therapyDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Outcomes by Condition</CardTitle>
          <CardDescription>Treatment success rates across different conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientOutcomes.map((outcome) => (
              <div key={outcome.condition} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{outcome.condition}</h4>
                  <div className="flex gap-2">
                    <Badge className="bg-green-100 text-green-800">{outcome.improved}% Improved</Badge>
                    <Badge variant="secondary">{outcome.maintained}% Maintained</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="h-2 bg-green-500 rounded-l" style={{ width: `${outcome.improved}%` }} />
                  <div className="h-2 bg-amber-400" style={{ width: `${outcome.maintained}%` }} />
                  <div className="h-2 bg-red-400 rounded-r" style={{ width: `${outcome.declined}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

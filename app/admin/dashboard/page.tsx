import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedUserTypes={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  )
}


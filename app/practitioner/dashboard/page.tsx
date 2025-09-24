import { PractitionerDashboard } from "@/components/practitioner/practitioner-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PractitionerDashboardPage() {
  return (
    <ProtectedRoute allowedUserTypes={['practitioner']}>
      <PractitionerDashboard />
    </ProtectedRoute>
  )
}

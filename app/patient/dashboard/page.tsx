import { PatientDashboard } from "@/components/patient/patient-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute allowedUserTypes={['patient']}>
      <PatientDashboard />
    </ProtectedRoute>
  )
}

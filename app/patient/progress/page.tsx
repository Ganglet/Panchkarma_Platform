import { TherapyProgress } from "@/components/progress/therapy-progress"

export default function PatientProgressPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">My Progress</h1>
              <p className="text-muted-foreground">Track your healing journey</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <TherapyProgress />
      </main>
    </div>
  )
}

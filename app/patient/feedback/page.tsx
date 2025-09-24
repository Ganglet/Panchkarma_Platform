import { FeedbackSystem } from "@/components/feedback/feedback-system"

export default function PatientFeedbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Session Feedback</h1>
              <p className="text-muted-foreground">Share your therapy experience</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <FeedbackSystem />
      </main>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Database, Key, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

export function SetupNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-4"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🧘</span>
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Panchakarma Platform
          </h1>
          <p className="text-muted-foreground text-lg">Traditional Ayurveda meets modern efficiency</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Alert className="mb-6">
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>Setup Required:</strong> The application is running in demo mode. To enable full functionality, please configure your Supabase database.
            </AlertDescription>
          </Alert>

          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Database className="h-6 w-6" />
                Database Setup Required
              </CardTitle>
              <CardDescription>
                Follow these steps to complete the setup and enable all features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Create Supabase Project</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                        supabase.com <ExternalLink className="h-3 w-3" />
                      </a> and create a new project
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Get API Keys</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Go to Settings → API and copy your Project URL and anon key
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Run Database Schema</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      In Supabase SQL Editor, run the contents of <code className="bg-muted px-2 py-1 rounded text-xs">database/schema.sql</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Configure Environment</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Create a <code className="bg-muted px-2 py-1 rounded text-xs">.env.local</code> file with your Supabase credentials
                    </p>
                    <div className="bg-muted p-3 rounded-lg text-xs font-mono">
                      <div>NEXT_PUBLIC_SUPABASE_URL=your_project_url</div>
                      <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Demo Mode Active</h4>
                    <p className="text-sm text-muted-foreground">
                      You can explore the UI, but authentication and data features are disabled
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Refresh After Setup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center mt-6 text-sm text-muted-foreground"
          >
            <p>Empowering healthcare with digital innovation</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

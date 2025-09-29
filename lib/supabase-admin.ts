import { createClient } from '@supabase/supabase-js'

// Server-side admin client using the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

// Lazily allow running without service key in dev, but warn
if (!serviceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Admin operations will be skipped.')
}

export const supabaseAdmin = serviceKey
  ? createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : undefined



// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Log untuk debugging (akan muncul di browser console)
console.log('Initializing Supabase client...')
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'NOT SET')
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'NOT SET')

// Validasi environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Supabase environment variables are missing!')
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables')
}

// Create Supabase client dengan error handling
let supabase
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
  console.log('✅ Supabase client initialized successfully')
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error)
  // Fallback untuk development
  supabase = {
    auth: {
      signInWithPassword: () => Promise.resolve({ 
        data: null, 
        error: { message: 'Supabase not initialized' } 
      }),
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => Promise.resolve({ error: null })
    }
  }
}

export { supabase }

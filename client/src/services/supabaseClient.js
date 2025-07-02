import { createClient } from '@supabase/supabase-js'

// These environment variables should be set in your Vite environment (.env file)
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Keep a copy of the current access token in localStorage (for Axios / Express API)
// and remove it on sign-out.
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.access_token) {
    localStorage.setItem('token', session.access_token)
  } else {
    localStorage.removeItem('token')
  }
})

supabase.auth.getSession().then(({ data }) => {
  if (data?.session?.access_token) {
    localStorage.setItem('token', data.session.access_token)
  }
}) 
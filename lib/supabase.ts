import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side only client with service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export type Exhibition = {
  id: string
  name: string
  school: string
  city: string
  country: string
  date: string
  status: 'upcoming' | 'active' | 'closed'
  cover_image: string | null
  slug: string
  description: string | null
  created_at: string
}

export type Artist = {
  id: string
  name: string
  school: string
  year: string
  bio: string
  photo_url: string
  instagram: string
  exhibition_id: string | null
  created_at: string
}

export type Work = {
  id: string
  artist_id: string
  title: string
  description: string
  medium: string
  width_cm: number
  height_cm: number
  year_created: number
  price: number
  status: 'available' | 'sold' | 'reserved'
  image_url: string
  cert_id: string
  exhibition_id: string | null
  created_at: string
  art_artists?: Artist
  exhibitions?: Exhibition
}

export type Order = {
  id: string
  work_id: string
  buyer_name: string
  buyer_email: string
  amount: number
  stripe_payment_id: string
  status: string
  created_at: string
  art_works?: Work
}

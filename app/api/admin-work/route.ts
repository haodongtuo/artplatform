import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SB_URL = 'https://mymezahwaaxunxaxqshe.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjAwNDMsImV4cCI6MjA4OTMzNjA0M30.NKq1a9aD3QT2m3T5Sz8SWCYfivXBrGMEUiG0GRJL_cQ'
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }

export async function POST(req: Request) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== '1') redirect('/admin')

  const form = await req.formData()
  const data = {
    artist_id: form.get('artist_id') as string,
    title: form.get('title') as string,
    description: form.get('description') as string,
    medium: form.get('medium') as string,
    year_created: form.get('year_created') as string,
    width_cm: Number(form.get('width_cm')) || 0,
    height_cm: Number(form.get('height_cm')) || 0,
    price: Number(form.get('price')) || 0,
    image_url: form.get('image_url') as string,
    status: 'available',
    cert_id: 'CERT-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
  }

  await fetch(`${SB_URL}/rest/v1/art_works`, {
    method: 'POST', headers: HDR, body: JSON.stringify(data)
  })

  redirect('/admin')
}

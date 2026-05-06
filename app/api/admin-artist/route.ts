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
    name: form.get('name') as string,
    school: form.get('school') as string,
    year: form.get('year') as string,
    bio: form.get('bio') as string,
    photo_url: form.get('photo_url') as string,
    instagram: form.get('instagram') as string,
  }

  await fetch(`${SB_URL}/rest/v1/art_artists`, {
    method: 'POST', headers: HDR, body: JSON.stringify(data)
  })

  redirect('/admin')
}

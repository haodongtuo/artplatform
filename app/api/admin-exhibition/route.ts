import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const authed = cookieStore.get('admin_auth')?.value === '1'
  if (!authed) redirect('/admin')

  const form = await req.formData()
  const body = {
    name: form.get('name'),
    school: form.get('school'),
    city: form.get('city'),
    country: form.get('country') || 'US',
    date: form.get('date') || null,
    status: form.get('status') || 'upcoming',
    slug: form.get('slug'),
    cover_image: form.get('cover_image') || null,
    description: form.get('description') || null,
  }

  await fetch(`${SB_URL}/rest/v1/exhibitions`, {
    method: 'POST',
    headers: HDR,
    body: JSON.stringify(body),
  })

  redirect('/admin')
}

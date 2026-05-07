import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

export async function POST(req: Request) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== '1') redirect('/admin')

  const form = await req.formData()
  const id = form.get('id') as string

  const body: any = {}
  const fields = ['name', 'school', 'city', 'country', 'date', 'status', 'cover_image', 'description']
  for (const f of fields) {
    const v = form.get(f)
    if (v !== null && v !== '') body[f] = v
  }

  await fetch(`${SB_URL}/rest/v1/exhibitions?id=eq.${id}`, {
    method: 'PATCH',
    headers: HDR,
    body: JSON.stringify(body),
  })

  redirect('/admin')
}

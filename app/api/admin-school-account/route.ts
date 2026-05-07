import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { hashPassword } from '@/lib/adminAuth'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const authed = cookieStore.get('admin_auth')?.value === '1'
  if (!authed) redirect('/admin')

  const form = await req.formData()
  const email = (form.get('email') as string)?.toLowerCase().trim()
  const password = form.get('password') as string
  const exhibition_id = form.get('exhibition_id') as string

  const password_hash = await hashPassword(password)

  await fetch(`${SB_URL}/rest/v1/school_admins`, {
    method: 'POST',
    headers: HDR,
    body: JSON.stringify({ email, password_hash, exhibition_id, role: 'school' }),
  })

  redirect('/admin')
}

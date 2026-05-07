import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyPassword } from '@/lib/adminAuth'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

export async function POST(req: Request) {
  const form = await req.formData()
  const email = (form.get('email') as string)?.toLowerCase().trim()
  const password = form.get('password') as string

  // 查找 school_admin
  const r = await fetch(
    `${SB_URL}/rest/v1/school_admins?email=eq.${encodeURIComponent(email)}&select=*`,
    { headers: HDR }
  )
  const admins = await r.json()
  const admin = admins?.[0]

  if (!admin) {
    redirect('/school-admin?err=1')
  }

  const ok = await verifyPassword(password, admin.password_hash)
  if (!ok) {
    redirect('/school-admin?err=1')
  }

  const cookieStore = await cookies()
  cookieStore.set('school_admin_auth', JSON.stringify({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    exhibition_id: admin.exhibition_id,
  }), { httpOnly: true, path: '/', maxAge: 60 * 60 * 8 })

  redirect('/school-admin/dashboard')
}

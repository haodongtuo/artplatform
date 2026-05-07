import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const isSuperAdmin = cookieStore.get('admin_auth')?.value === '1'
  const schoolAdminRaw = cookieStore.get('school_admin_auth')?.value
  if (!isSuperAdmin && !schoolAdminRaw) redirect('/admin')

  const form = await req.formData()
  const email = (form.get('email') as string)?.toLowerCase().trim()
  const password = form.get('password') as string
  const exhibition_id = form.get('exhibition_id') as string | null
  const name = form.get('name') as string
  const school = form.get('school') as string
  const year = form.get('year') as string
  const bio = form.get('bio') as string
  const photo_url = form.get('photo_url') as string
  const instagram = form.get('instagram') as string

  // 1. 用 admin API 创建 Supabase 用户
  const authRes = await fetch(`${SB_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: HDR,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true, // 跳过邮件验证，直接激活
    }),
  })
  const authData = await authRes.json()
  const userId = authData.id

  if (!userId) {
    // 已存在的邮箱——仍然创建艺术家档案（不绑定 user_id）
    const artistBody: any = { name, school, year, bio, photo_url, instagram }
    if (exhibition_id) artistBody.exhibition_id = exhibition_id
    await fetch(`${SB_URL}/rest/v1/art_artists`, {
      method: 'POST',
      headers: { ...HDR, Prefer: 'return=minimal' },
      body: JSON.stringify(artistBody),
    })
  } else {
    // 2. 创建艺术家档案，绑定 user_id
    const artistBody: any = { name, school, year, bio, photo_url, instagram, user_id: userId }
    if (exhibition_id) artistBody.exhibition_id = exhibition_id
    await fetch(`${SB_URL}/rest/v1/art_artists`, {
      method: 'POST',
      headers: { ...HDR, Prefer: 'return=minimal' },
      body: JSON.stringify(artistBody),
    })
  }

  if (schoolAdminRaw && !isSuperAdmin) redirect('/school-admin/dashboard')
  redirect('/admin')
}

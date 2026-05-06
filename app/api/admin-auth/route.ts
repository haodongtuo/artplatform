import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const PWD = 'art2026admin'

export async function POST(req: Request) {
  const form = await req.formData()
  const pw = form.get('password') as string
  if (pw === PWD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', '1', { httpOnly: true, path: '/', maxAge: 60 * 60 * 8 })
    redirect('/admin')
  } else {
    redirect('/admin?err=1')
  }
}

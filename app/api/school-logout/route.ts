import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('school_admin_auth')
  redirect('/school-admin')
}

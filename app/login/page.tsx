'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SB_URL = 'https://bdwfrstysliwvbbualgd.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkd2Zyc3R5c2xpd3ZiYnVhbGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODM5NzAsImV4cCI6MjA5MzY1OTk3MH0.GJb_AjV6xv8Rpy-lCuXiSl3bStViGQk36EEU9MmisvU'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password }),
    })
    const d = await r.json()
    setLoading(false)
    if (!r.ok || d.error) { setError(d.error_description || d.error || 'Login failed'); return }

    const token = d.access_token
    const userId = d.user?.id

    // Fetch artist profile
    const ar = await fetch(`${SB_URL}/rest/v1/art_artists?user_id=eq.${userId}&select=id,name`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` }
    })
    const artists = await ar.json()

    localStorage.setItem('art_token', token)
    if (artists.length > 0) {
      localStorage.setItem('art_artist_id', artists[0].id)
      localStorage.setItem('art_artist_name', artists[0].name)
      router.push('/dashboard')
    } else {
      // New user without profile
      localStorage.setItem('art_user_id', userId)
      router.push('/register?step=profile')
    }
  }

  const inputStyle = { width: '100%', border: '1px solid #ddd', borderRadius: '4px', padding: '10px 14px', fontSize: '14px', marginBottom: '4px' } as React.CSSProperties

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 300, textAlign: 'center', marginBottom: '8px' }}>Art 2026</h1>
        <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginBottom: '32px' }}>Sign in to your artist account</p>
        <form onSubmit={handleLogin}>
          <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Email</label>
          <input style={inputStyle} type="email" required value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
          <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginTop: '12px', display: 'block' }}>Password</label>
          <input style={inputStyle} type="password" required value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
          {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>{error}</p>}
          <button style={{ width: '100%', background: '#111', color: 'white', border: 'none', padding: '12px', fontSize: '14px', cursor: 'pointer', borderRadius: '4px', marginTop: '16px' }}
            type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#999', marginTop: '16px' }}>
            New artist? <Link href="/register" style={{ color: '#111' }}>Create account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

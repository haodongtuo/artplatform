'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SB_URL = 'https://mymezahwaaxunxaxqshe.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjAwNDMsImV4cCI6MjA4OTMzNjA0M30.NKq1a9aD3QT2m3T5Sz8SWCYfivXBrGMEUiG0GRJL_cQ'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'account' | 'profile'>('account')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')
  const [token, setToken] = useState('')

  const [account, setAccount] = useState({ email: '', password: '', password2: '' })
  const [profile, setProfile] = useState({ name: '', school: '', bio: '', photo_url: '', instagram: '' })

  async function handleAccount(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (account.password !== account.password2) { setError('Passwords do not match'); return }
    if (account.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const r = await fetch(`${SB_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: account.email, password: account.password }),
    })
    const d = await r.json()
    setLoading(false)
    if (!r.ok || d.error) { setError(d.error?.message || d.msg || 'Registration failed'); return }
    setUserId(d.user?.id || d.id)
    setToken(d.access_token)
    setStep('profile')
  }

  async function handleProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile.name) { setError('Name is required'); return }
    setLoading(true)
    const r = await fetch(`${SB_URL}/rest/v1/art_artists`, {
      method: 'POST',
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ ...profile, year: '2026', user_id: userId }),
    })
    const d = await r.json()
    setLoading(false)
    if (!r.ok) { setError('Failed to save profile, please try again'); return }
    // Save token to localStorage for dashboard
    localStorage.setItem('art_token', token)
    localStorage.setItem('art_artist_id', d[0]?.id)
    localStorage.setItem('art_artist_name', profile.name)
    router.push('/dashboard')
  }

  const inputStyle = { width: '100%', border: '1px solid #ddd', borderRadius: '4px', padding: '10px 14px', fontSize: '14px', marginBottom: '4px' } as React.CSSProperties
  const btnStyle = { width: '100%', background: '#111', color: 'white', border: 'none', padding: '12px', fontSize: '14px', cursor: 'pointer', borderRadius: '4px', marginTop: '16px' } as React.CSSProperties

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 300, textAlign: 'center', marginBottom: '8px' }}>
          Art 2026
        </h1>
        <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginBottom: '32px' }}>
          {step === 'account' ? 'Create your artist account' : 'Tell us about yourself'}
        </p>

        {step === 'account' && (
          <form onSubmit={handleAccount}>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Email</label>
            <input style={inputStyle} type="email" required value={account.email}
              onChange={e => setAccount({ ...account, email: e.target.value })} />
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginTop: '12px', display: 'block' }}>Password</label>
            <input style={inputStyle} type="password" required value={account.password}
              onChange={e => setAccount({ ...account, password: e.target.value })} />
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginTop: '12px', display: 'block' }}>Confirm Password</label>
            <input style={inputStyle} type="password" required value={account.password2}
              onChange={e => setAccount({ ...account, password2: e.target.value })} />
            {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>{error}</p>}
            <button style={btnStyle} type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Continue →'}</button>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#999', marginTop: '16px' }}>
              Already have an account? <Link href="/login" style={{ color: '#111' }}>Sign in</Link>
            </p>
          </form>
        )}

        {step === 'profile' && (
          <form onSubmit={handleProfile}>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Full Name *</label>
            <input style={inputStyle} required value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })} />
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginTop: '12px', display: 'block' }}>School / Department</label>
            <input style={inputStyle} value={profile.school}
              onChange={e => setProfile({ ...profile, school: e.target.value })} />
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginTop: '12px', display: 'block' }}>Bio (optional)</label>
            <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' } as React.CSSProperties}
              value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginTop: '12px', display: 'block' }}>Instagram (optional)</label>
            <input style={inputStyle} placeholder="@username" value={profile.instagram}
              onChange={e => setProfile({ ...profile, instagram: e.target.value })} />
            {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>{error}</p>}
            <button style={btnStyle} type="submit" disabled={loading}>{loading ? 'Saving…' : 'Enter Gallery →'}</button>
          </form>
        )}
      </div>
    </div>
  )
}

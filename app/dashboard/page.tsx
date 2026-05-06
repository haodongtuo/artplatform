'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SB_URL = 'https://mymezahwaaxunxaxqshe.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjAwNDMsImV4cCI6MjA4OTMzNjA0M30.NKq1a9aD3QT2m3T5Sz8SWCYfivXBrGMEUiG0GRJL_cQ'

function hdr(token: string) {
  return { apikey: SB_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export default function DashboardPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [artistId, setArtistId] = useState('')
  const [artistName, setArtistName] = useState('')
  const [works, setWorks] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', medium: '', year_created: '2026',
    width_cm: '', height_cm: '', price: '', image_url: ''
  })

  useEffect(() => {
    const t = localStorage.getItem('art_token') || ''
    const aid = localStorage.getItem('art_artist_id') || ''
    const aname = localStorage.getItem('art_artist_name') || ''
    if (!t || !aid) { router.push('/login'); return }
    setToken(t); setArtistId(aid); setArtistName(aname)
    loadData(t, aid)
  }, [])

  async function loadData(t: string, aid: string) {
    const [wr, or] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/art_works?artist_id=eq.${aid}&order=created_at.desc`, { headers: hdr(t) }),
      fetch(`${SB_URL}/rest/v1/art_orders?select=*,art_works(title)&order=created_at.desc`, { headers: hdr(t) }),
    ])
    const wdata = wr.ok ? await wr.json() : []
    const odata = or.ok ? await or.json() : []
    // Filter orders for this artist's works
    const workIds = new Set(wdata.map((w: any) => w.id))
    setWorks(wdata)
    setOrders(odata.filter((o: any) => workIds.has(o.work_id)))
  }

  async function saveWork(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) { setMsg('Title is required'); return }
    setSaving(true)
    const payload = {
      artist_id: artistId,
      title: form.title,
      description: form.description,
      medium: form.medium,
      year_created: form.year_created || '2026',
      width_cm: Number(form.width_cm) || 0,
      height_cm: Number(form.height_cm) || 0,
      price: Number(form.price) || 0,
      image_url: form.image_url,
      status: 'available',
      cert_id: 'CERT-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    }
    const r = await fetch(`${SB_URL}/rest/v1/art_works`, {
      method: 'POST',
      headers: { ...hdr(token), Prefer: 'return=minimal' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (r.ok) {
      setMsg('Work added! It\'s now live in the gallery.')
      setForm({ title: '', description: '', medium: '', year_created: '2026', width_cm: '', height_cm: '', price: '', image_url: '' })
      setShowForm(false)
      loadData(token, artistId)
    } else {
      setMsg('Failed to save. Please try again.')
    }
  }

  function logout() {
    localStorage.clear()
    router.push('/')
  }

  const inp: React.CSSProperties = { width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px' }
  const lbl: React.CSSProperties = { fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px', marginTop: '12px' }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 300 }}>
              Welcome, {artistName}
            </h1>
            <p style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>
              <Link href="/gallery" style={{ color: '#999' }}>View gallery →</Link>
            </p>
          </div>
          <button onClick={logout}
            style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>

        {msg && (
          <div style={{ background: '#f0fdf4', color: '#166534', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontSize: '14px' }}>
            {msg}
          </div>
        )}

        {/* Add Work */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400 }}>My Works</h2>
            <button onClick={() => setShowForm(!showForm)}
              style={{ background: '#111', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>
              {showForm ? 'Cancel' : '+ Add Work'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={saveWork} style={{ marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>Title *</label>
                  <input style={inp} required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>Description</label>
                  <textarea style={{ ...inp, height: '80px', resize: 'vertical' } as React.CSSProperties}
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <label style={lbl}>Medium</label>
                  <input style={inp} placeholder="e.g. Oil on canvas" value={form.medium}
                    onChange={e => setForm({ ...form, medium: e.target.value })} />
                </div>
                <div>
                  <label style={lbl}>Year</label>
                  <input style={inp} value={form.year_created} onChange={e => setForm({ ...form, year_created: e.target.value })} />
                </div>
                <div>
                  <label style={lbl}>Width (cm)</label>
                  <input style={inp} type="number" value={form.width_cm} onChange={e => setForm({ ...form, width_cm: e.target.value })} />
                </div>
                <div>
                  <label style={lbl}>Height (cm)</label>
                  <input style={inp} type="number" value={form.height_cm} onChange={e => setForm({ ...form, height_cm: e.target.value })} />
                </div>
                <div>
                  <label style={lbl}>Price (USD)</label>
                  <input style={inp} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>Image URL</label>
                  <input style={inp} placeholder="https://…" value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })} />
                  <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                    Upload your image to imgur.com or Google Drive and paste the link here
                  </p>
                </div>
              </div>
              <button type="submit" disabled={saving}
                style={{ marginTop: '20px', background: '#111', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                {saving ? 'Saving…' : 'Publish Work →'}
              </button>
            </form>
          )}

          {/* Works list */}
          <div style={{ marginTop: showForm ? '24px' : '16px' }}>
            {works.length === 0 && !showForm && (
              <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
                No works yet. Add your first piece!
              </p>
            )}
            {works.map((w: any) => (
              <div key={w.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '4px', marginTop: '8px' }}>
                {w.image_url && (
                  <img src={w.image_url} alt={w.title}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{w.title}</p>
                  <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>{w.medium} · ${w.price}</p>
                </div>
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                  background: w.status === 'sold' ? '#fef2f2' : '#f0fdf4',
                  color: w.status === 'sold' ? '#dc2626' : '#166534'
                }}>{w.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        {orders.length > 0 && (
          <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, marginBottom: '16px' }}>Sales</h2>
            {orders.map((o: any) => (
              <div key={o.id} style={{ padding: '12px', border: '1px solid #f0f0f0', borderRadius: '4px', marginBottom: '8px' }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{o.art_works?.title}</p>
                <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>{o.buyer_name} · ${o.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

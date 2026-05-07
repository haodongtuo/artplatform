'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function hdr(token: string) {
  return { apikey: SB_ANON, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export default function DashboardPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [artistId, setArtistId] = useState('')
  const [artistName, setArtistName] = useState('')
  const [artist, setArtist] = useState<any>(null)
  const [works, setWorks] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingPayment, setSavingPayment] = useState(false)
  const [msg, setMsg] = useState('')
  const [paymentMsg, setPaymentMsg] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', medium: '', year_created: '2026',
    width_cm: '', height_cm: '', price: '521', image_url: ''
  })
  const [paymentForm, setPaymentForm] = useState({ venmo: '', zelle: '' })

  useEffect(() => {
    const t = localStorage.getItem('art_token') || ''
    const aid = localStorage.getItem('art_artist_id') || ''
    const aname = localStorage.getItem('art_artist_name') || ''
    if (!t || !aid) { router.push('/login'); return }
    setToken(t); setArtistId(aid); setArtistName(aname)
    loadData(t, aid)
  }, [])

  async function loadData(t: string, aid: string) {
    const [ar, wr, or] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/art_artists?id=eq.${aid}&select=*`, { headers: hdr(t) }),
      fetch(`${SB_URL}/rest/v1/art_works?artist_id=eq.${aid}&order=created_at.desc`, { headers: hdr(t) }),
      fetch(`${SB_URL}/rest/v1/art_orders?select=*,art_works(title)&order=created_at.desc`, { headers: hdr(t) }),
    ])
    const adata = ar.ok ? await ar.json() : []
    const wdata = wr.ok ? await wr.json() : []
    const odata = or.ok ? await or.json() : []
    if (adata[0]) {
      setArtist(adata[0])
      setPaymentForm({ venmo: adata[0].venmo || '', zelle: adata[0].zelle || '' })
    }
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
      price: Number(form.price) || 521,
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
      setMsg('✓ Work published! It\'s now live in the gallery.')
      setForm({ title: '', description: '', medium: '', year_created: '2026', width_cm: '', height_cm: '', price: '521', image_url: '' })
      setShowForm(false)
      loadData(token, artistId)
    } else {
      setMsg('Failed to save. Please try again.')
    }
  }

  async function savePayment(e: React.FormEvent) {
    e.preventDefault()
    if (!paymentForm.venmo && !paymentForm.zelle) {
      setPaymentMsg('Please enter at least one payment method')
      return
    }
    setSavingPayment(true)
    const r = await fetch(`${SB_URL}/rest/v1/art_artists?id=eq.${artistId}`, {
      method: 'PATCH',
      headers: { ...hdr(token), Prefer: 'return=minimal' },
      body: JSON.stringify({ venmo: paymentForm.venmo, zelle: paymentForm.zelle }),
    })
    setSavingPayment(false)
    if (r.ok) {
      setPaymentMsg('✓ Payment info saved! Buyers can now pay you directly.')
      setShowPaymentForm(false)
      loadData(token, artistId)
    } else {
      setPaymentMsg('Failed to save. Please try again.')
    }
  }

  function logout() {
    localStorage.clear()
    router.push('/')
  }

  const inp: React.CSSProperties = { width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px' }
  const lbl: React.CSSProperties = { fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px', marginTop: '12px' }
  const hasPayment = artist?.venmo || artist?.zelle

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
              <Link href="/gallery" style={{ color: '#d97706' }}>View gallery →</Link>
            </p>
          </div>
          <button onClick={logout}
            style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>

        {/* Payment Setup Banner */}
        {!hasPayment && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '14px', color: '#92400e', margin: '0 0 4px' }}>⚠️ Set up your payment info</p>
              <p style={{ fontSize: '13px', color: '#b45309', margin: 0 }}>Buyers can't purchase your work until you add a Venmo or Zelle account.</p>
            </div>
            <button onClick={() => setShowPaymentForm(true)}
              style={{ background: '#d97706', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: '16px' }}>
              Set up now →
            </button>
          </div>
        )}

        {/* Payment Info Card */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, margin: 0 }}>
              💳 Payment Info
            </h2>
            <button onClick={() => setShowPaymentForm(!showPaymentForm)}
              style={{ background: 'none', border: '1px solid #e5e5e5', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', color: '#666' }}>
              {showPaymentForm ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!showPaymentForm && (
            <div style={{ marginTop: '16px' }}>
              {hasPayment ? (
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {artist?.venmo && (
                    <div style={{ background: '#eff9ff', border: '1px solid #bae6fd', borderRadius: '6px', padding: '12px 16px' }}>
                      <p style={{ fontSize: '11px', color: '#0369a1', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Venmo</p>
                      <p style={{ fontWeight: 600, fontSize: '15px', margin: 0 }}>{artist.venmo}</p>
                    </div>
                  )}
                  {artist?.zelle && (
                    <div style={{ background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '6px', padding: '12px 16px' }}>
                      <p style={{ fontSize: '11px', color: '#7e22ce', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zelle</p>
                      <p style={{ fontWeight: 600, fontSize: '15px', margin: 0 }}>{artist.zelle}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: '#999', fontSize: '14px' }}>No payment info yet. Buyers won't be able to purchase your work.</p>
              )}
            </div>
          )}

          {showPaymentForm && (
            <form onSubmit={savePayment} style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
                Buyers will pay you <strong>directly</strong> via Venmo or Zelle — no platform fees, no waiting.
                Add at least one payment method.
              </p>
              <div>
                <label style={lbl}>Venmo Username</label>
                <input style={inp} placeholder="@yourname"
                  value={paymentForm.venmo} onChange={e => setPaymentForm({ ...paymentForm, venmo: e.target.value })} />
                <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>e.g. @jane-smith — buyers tap this to open Venmo with amount pre-filled</p>
              </div>
              <div>
                <label style={lbl}>Zelle (phone or email)</label>
                <input style={inp} placeholder="phone number or email"
                  value={paymentForm.zelle} onChange={e => setPaymentForm({ ...paymentForm, zelle: e.target.value })} />
                <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>e.g. 213-555-0100 or jane@email.com</p>
              </div>
              {paymentMsg && <p style={{ fontSize: '13px', color: paymentMsg.startsWith('✓') ? '#166534' : '#dc2626', marginTop: '8px' }}>{paymentMsg}</p>}
              <button type="submit" disabled={savingPayment}
                style={{ marginTop: '16px', background: '#d97706', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                {savingPayment ? 'Saving…' : 'Save Payment Info'}
              </button>
            </form>
          )}
        </div>

        {msg && (
          <div style={{ background: '#f0fdf4', color: '#166534', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontSize: '14px' }}>
            {msg}
          </div>
        )}

        {/* Works */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, margin: 0 }}>My Works</h2>
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
                  <label style={lbl}>Description — tell the story of this piece</label>
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
                  <label style={lbl}>Price (USD) — May 21 = $521</label>
                  <input style={inp} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>Image URL</label>
                  <input style={inp} placeholder="https://…" value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })} />
                  <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                    Upload to <a href="https://imgur.com" target="_blank" style={{ color: '#d97706' }}>imgur.com</a> and paste the direct link here
                  </p>
                </div>
              </div>
              <button type="submit" disabled={saving}
                style={{ marginTop: '20px', background: '#111', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                {saving ? 'Saving…' : 'Publish Work →'}
              </button>
            </form>
          )}

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
                <a href={`/work/${w.id}`} target="_blank"
                  style={{ fontSize: '12px', color: '#999', textDecoration: 'none' }}>View</a>
                <a href={`/work/${w.id}/print`} target="_blank"
                  style={{ fontSize: '12px', color: '#d97706', textDecoration: 'none', whiteSpace: 'nowrap' }}>🖨️ QR</a>
              </div>
            ))}
          </div>
        </div>

        {/* Sales */}
        {orders.length > 0 && (
          <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, marginBottom: '16px' }}>
              🎉 Sales ({orders.length})
            </h2>
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

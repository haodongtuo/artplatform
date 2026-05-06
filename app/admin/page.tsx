'use client'
import { useState, useEffect, useRef } from 'react'

const PWD = 'art2026admin'
const SB_URL = 'https://mymezahwaaxunxaxqshe.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjAwNDMsImV4cCI6MjA4OTMzNjA0M30.NKq1a9aD3QT2m3T5Sz8SWCYfivXBrGMEUiG0GRJL_cQ'

const hdr = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

async function get(table: string, select = '*') {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?select=${select}&order=created_at.desc`, { headers: hdr })
  return r.ok ? r.json() : []
}
async function ins(table: string, data: object) {
  await fetch(`${SB_URL}/rest/v1/${table}`, { method: 'POST', headers: { ...hdr, Prefer: 'return=minimal' }, body: JSON.stringify(data) })
}
async function upd(table: string, id: string, data: object) {
  await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, { method: 'PATCH', headers: { ...hdr, Prefer: 'return=minimal' }, body: JSON.stringify(data) })
}
async function del(table: string, id: string) {
  await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, { method: 'DELETE', headers: hdr })
}

type Tab = 'works' | 'artists' | 'orders' | 'qrcodes'

export default function Admin() {
  const [ok, setOk] = useState(false)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState<Tab>('works')
  const [artists, setArtists] = useState<any[]>([])
  const [works, setWorks] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [editArtistId, setEditArtistId] = useState<string | null>(null)
  const [editWorkId, setEditWorkId] = useState<string | null>(null)

  const [af, setAf] = useState({ name: '', school: '', year: '2026', bio: '', photo_url: '', instagram: '' })
  const [wf, setWf] = useState({ artist_id: '', title: '', description: '', medium: '', width_cm: '', height_cm: '', year_created: '2026', price: '', image_url: '' })

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  async function load() {
    const [a, w, o] = await Promise.all([
      get('art_artists'),
      get('art_works', '*,art_artists(name)'),
      get('art_orders', '*,art_works(title)'),
    ])
    setArtists(a); setWorks(w); setOrders(o)
  }

  function doLogin() {
    if (pw.trim() === PWD) { setOk(true); load() }
    else setErr('Wrong password')
  }

  async function saveArtist() {
    if (!af.name) return flash('Name required')
    if (editArtistId) { await upd('art_artists', editArtistId, af); setEditArtistId(null) }
    else await ins('art_artists', af)
    setAf({ name: '', school: '', year: '2026', bio: '', photo_url: '', instagram: '' })
    flash('Saved!'); load()
  }

  async function saveWork() {
    if (!wf.title || !wf.artist_id) return flash('Title + artist required')
    const payload = { ...wf, width_cm: +wf.width_cm || 0, height_cm: +wf.height_cm || 0, price: +wf.price || 0, status: 'available' }
    if (editWorkId) { await upd('art_works', editWorkId, payload); setEditWorkId(null) }
    else { await ins('art_works', { ...payload, cert_id: 'CERT-' + Math.random().toString(36).substr(2, 8).toUpperCase() }) }
    setWf({ artist_id: '', title: '', description: '', medium: '', width_cm: '', height_cm: '', year_created: '2026', price: '', image_url: '' })
    flash('Saved!'); load()
  }

  if (!ok) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', width: '320px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 300, textAlign: 'center', marginBottom: '24px' }}>Admin</h1>
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr('') }}
          onKeyDown={e => e.key === 'Enter' && doLogin()}
          autoFocus
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', padding: '10px 14px', fontSize: '14px', marginBottom: '8px', boxSizing: 'border-box' }}
        />
        {err && <p style={{ color: 'red', fontSize: '12px', marginBottom: '8px' }}>{err}</p>}
        <button
          onClick={doLogin}
          style={{ width: '100%', background: '#111', color: 'white', border: 'none', padding: '12px', fontSize: '14px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Enter
        </button>
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '12px' }}>Hint: art2026admin</p>
      </div>
    </div>
  )

  const inp: React.CSSProperties = { width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '13px', boxSizing: 'border-box' }
  const btn: React.CSSProperties = { background: '#111', color: 'white', border: 'none', padding: '8px 20px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px' }
  const btnGhost: React.CSSProperties = { background: 'white', color: '#111', border: '1px solid #ddd', padding: '8px 20px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px' }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 300 }}>Admin</h1>
        {msg && <span style={{ background: '#f0fdf4', color: '#166534', padding: '8px 16px', borderRadius: '4px', fontSize: '13px' }}>{msg}</span>}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', marginBottom: '32px' }}>
        {(['works', 'artists', 'orders', 'qrcodes'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 24px', fontSize: '13px', border: 'none', borderBottom: tab === t ? '2px solid #111' : '2px solid transparent',
            background: 'none', cursor: 'pointer', color: tab === t ? '#111' : '#999', textTransform: 'capitalize'
          }}>{t}</button>
        ))}
      </div>

      {/* WORKS */}
      {tab === 'works' && (
        <div>
          <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, marginBottom: '16px' }}>{editWorkId ? 'Edit Work' : 'Add Work'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Artist</label>
                <select value={wf.artist_id} onChange={e => setWf({ ...wf, artist_id: e.target.value })} style={inp}>
                  <option value="">Select Artist</option>
                  {artists.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Title</label>
                <input style={inp} value={wf.title} onChange={e => setWf({ ...wf, title: e.target.value })} placeholder="Artwork title" />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Medium</label>
                <input style={inp} value={wf.medium} onChange={e => setWf({ ...wf, medium: e.target.value })} placeholder="Oil on canvas..." />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Price (USD)</label>
                <input style={inp} type="number" value={wf.price} onChange={e => setWf({ ...wf, price: e.target.value })} placeholder="500" />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Width (cm)</label>
                <input style={inp} type="number" value={wf.width_cm} onChange={e => setWf({ ...wf, width_cm: e.target.value })} placeholder="60" />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Height (cm)</label>
                <input style={inp} type="number" value={wf.height_cm} onChange={e => setWf({ ...wf, height_cm: e.target.value })} placeholder="80" />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Year</label>
                <input style={inp} type="number" value={wf.year_created} onChange={e => setWf({ ...wf, year_created: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Image URL</label>
                <input style={inp} value={wf.image_url} onChange={e => setWf({ ...wf, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Description</label>
                <textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={wf.description} onChange={e => setWf({ ...wf, description: e.target.value })} placeholder="About this work..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button style={btn} onClick={saveWork}>{editWorkId ? 'Update' : 'Add Work'}</button>
              {editWorkId && <button style={btnGhost} onClick={() => { setEditWorkId(null); setWf({ artist_id: '', title: '', description: '', medium: '', width_cm: '', height_cm: '', year_created: '2026', price: '', image_url: '' }) }}>Cancel</button>}
            </div>
          </div>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, marginBottom: '16px' }}>All Works ({works.length})</h2>
          {works.map((w: any) => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '4px', marginBottom: '8px' }}>
              {w.image_url && <img src={w.image_url} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: '14px', margin: 0 }}>{w.title}</p>
                <p style={{ color: '#999', fontSize: '12px', margin: '2px 0 0' }}>{w.art_artists?.name} · ${w.price} · {w.medium}</p>
              </div>
              <select value={w.status} onChange={e => { upd('art_works', w.id, { status: e.target.value }); load() }}
                style={{ border: '1px solid #e5e5e5', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
              <button onClick={() => { setEditWorkId(w.id); setWf({ artist_id: w.artist_id, title: w.title, description: w.description || '', medium: w.medium || '', width_cm: String(w.width_cm || ''), height_cm: String(w.height_cm || ''), year_created: String(w.year_created || '2026'), price: String(w.price || ''), image_url: w.image_url || '' }); setTab('works'); window.scrollTo(0,0) }}
                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
              <button onClick={async () => { if (confirm('Delete?')) { await del('art_works', w.id); load() } }}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
            </div>
          ))}
          {works.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>No works yet</p>}
        </div>
      )}

      {/* ARTISTS */}
      {tab === 'artists' && (
        <div>
          <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, marginBottom: '16px' }}>{editArtistId ? 'Edit Artist' : 'Add Artist'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[['name', 'Name', 'Full name'], ['school', 'School', 'University'], ['year', 'Graduation Year', '2026'], ['instagram', 'Instagram', '@handle'], ['photo_url', 'Photo URL', 'https://...']].map(([k, l, p]) => (
                <div key={k}>
                  <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>{l}</label>
                  <input style={inp} value={(af as any)[k]} onChange={e => setAf({ ...af, [k]: e.target.value })} placeholder={p} />
                </div>
              ))}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Bio</label>
                <textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={af.bio} onChange={e => setAf({ ...af, bio: e.target.value })} placeholder="Artist biography..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button style={btn} onClick={saveArtist}>{editArtistId ? 'Update' : 'Add Artist'}</button>
              {editArtistId && <button style={btnGhost} onClick={() => { setEditArtistId(null); setAf({ name: '', school: '', year: '2026', bio: '', photo_url: '', instagram: '' }) }}>Cancel</button>}
            </div>
          </div>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, marginBottom: '16px' }}>All Artists ({artists.length})</h2>
          {artists.map((a: any) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '4px', marginBottom: '8px' }}>
              {a.photo_url && <img src={a.photo_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: '14px', margin: 0 }}>{a.name}</p>
                <p style={{ color: '#999', fontSize: '12px', margin: '2px 0 0' }}>{a.school} · Class of {a.year}</p>
              </div>
              <button onClick={() => { setEditArtistId(a.id); setAf({ name: a.name, school: a.school || '', year: a.year || '2026', bio: a.bio || '', photo_url: a.photo_url || '', instagram: a.instagram || '' }); window.scrollTo(0,0) }}
                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
              <button onClick={async () => { if (confirm('Delete?')) { await del('art_artists', a.id); load() } }}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
            </div>
          ))}
          {artists.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>No artists yet</p>}
        </div>
      )}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, marginBottom: '16px' }}>Orders ({orders.length})</h2>
          {orders.map((o: any) => (
            <div key={o.id} style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: '14px', margin: 0 }}>{o.buyer_name} — {o.buyer_email}</p>
                <p style={{ color: '#999', fontSize: '12px', margin: '4px 0 0' }}>{o.art_works?.title}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 600, margin: 0 }}>${o.amount}</p>
                <p style={{ color: '#999', fontSize: '12px', margin: '4px 0 0' }}>{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>No orders yet</p>}
        </div>
      )}

      {/* QR CODES */}
      {tab === 'qrcodes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, margin: 0 }}>QR Codes</h2>
              <p style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>Print and place next to each artwork at the exhibition</p>
            </div>
            <button style={btn} onClick={async () => {
              const QR = (await import('qrcode')).default
              const siteUrl = window.location.origin
              const win = window.open('', '_blank')
              if (!win) return
              const qrs = []
              for (const w of works) {
                const url = await QR.toDataURL(`${siteUrl}/work/${w.id}`, { width: 200, margin: 2 })
                qrs.push({ url, title: w.title, artist: w.art_artists?.name || '' })
              }
              win.document.write(`<!DOCTYPE html><html><head><style>body{font-family:serif;padding:20px}h1{text-align:center}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.card{text-align:center;border:1px solid #ddd;padding:12px;page-break-inside:avoid}.card img{width:120px;height:120px}.title{font-size:11px;font-weight:bold;margin-top:6px}.artist{font-size:10px;color:#666}</style></head><body><h1>Art Exhibition 2026 — QR Codes</h1><div class="grid">${qrs.map(q=>`<div class="card"><img src="${q.url}"/><div class="title">${q.title}</div><div class="artist">${q.artist}</div></div>`).join('')}</div><script>window.onload=()=>window.print()</script></body></html>`)
              win.document.close()
            }}>
              Print All QR Codes ({works.length})
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {works.map((w: any) => <QRCard key={w.id} work={w} />)}
          </div>
          {works.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>No works yet — add works first</p>}
        </div>
      )}
    </div>
  )
}

function QRCard({ work }: { work: any }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const url = `${window.location.origin}/work/${work.id}`
    import('qrcode').then(m => m.default.toCanvas(ref.current!, url, { width: 80, margin: 1 }))
  }, [work.id])
  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: '4px', padding: '12px', textAlign: 'center' }}>
      <canvas ref={ref} style={{ display: 'block', margin: '0 auto' }} />
      <p style={{ fontSize: '11px', fontWeight: 600, margin: '8px 0 0' }}>{work.title}</p>
      <p style={{ fontSize: '11px', color: '#999', margin: '2px 0 0' }}>{work.art_artists?.name}</p>
    </div>
  )
}

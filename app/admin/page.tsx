'use client'
import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

const ADMIN_PASSWORD = 'art2026admin'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

type Tab = 'works' | 'artists' | 'orders' | 'qrcodes'

interface Artist {
  id: string; name: string; school: string; year: string
  bio: string; photo_url: string; instagram: string
}
interface Work {
  id: string; artist_id: string; title: string; description: string
  medium: string; width_cm: number; height_cm: number
  year_created: string; price: number; status: string
  image_url: string; cert_id: string; art_artists?: Artist
}
interface Order {
  id: string; buyer_name: string; buyer_email: string
  amount: number; status: string; created_at: string
  art_works?: { title: string }
}

async function sbGet(table: string, select = '*') {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=${select}&order=created_at.desc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  return res.json()
}

async function sbInsert(table: string, data: Record<string, unknown>) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal'
    },
    body: JSON.stringify(data)
  })
}

async function sbUpdate(table: string, id: string, data: Record<string, unknown>) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal'
    },
    body: JSON.stringify(data)
  })
}

async function sbDelete(table: string, id: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  })
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [tab, setTab] = useState<Tab>('works')
  const [artists, setArtists] = useState<Artist[]>([])
  const [works, setWorks] = useState<Work[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const emptyArtist = { name: '', school: '', year: '2026', bio: '', photo_url: '', instagram: '' }
  const emptyWork = { artist_id: '', title: '', description: '', medium: '', width_cm: '', height_cm: '', year_created: '2026', price: '', image_url: '' }

  const [artistForm, setArtistForm] = useState(emptyArtist)
  const [editingArtist, setEditingArtist] = useState<string | null>(null)
  const [workForm, setWorkForm] = useState(emptyWork)
  const [editingWork, setEditingWork] = useState<string | null>(null)

  function login() {
    if (password === ADMIN_PASSWORD) { setAuthed(true); loadData() }
    else setPwError('Incorrect password')
  }

  async function loadData() {
    setLoading(true)
    const [a, w, o] = await Promise.all([
      sbGet('art_artists', '*'),
      sbGet('art_works', '*,art_artists(name)'),
      sbGet('art_orders', '*,art_works(title)'),
    ])
    setArtists(Array.isArray(a) ? a : [])
    setWorks(Array.isArray(w) ? w : [])
    setOrders(Array.isArray(o) ? o : [])
    setLoading(false)
  }

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  async function saveArtist() {
    if (!artistForm.name) return flash('Name is required')
    if (editingArtist) {
      await sbUpdate('art_artists', editingArtist, artistForm)
      setEditingArtist(null); flash('Artist updated')
    } else {
      await sbInsert('art_artists', artistForm); flash('Artist added')
    }
    setArtistForm(emptyArtist); loadData()
  }

  async function deleteArtist(id: string) {
    if (!confirm('Delete this artist?')) return
    await sbDelete('art_artists', id); flash('Deleted'); loadData()
  }

  function editArtist(a: Artist) {
    setEditingArtist(a.id)
    setArtistForm({ name: a.name, school: a.school, year: a.year, bio: a.bio, photo_url: a.photo_url, instagram: a.instagram })
    setTab('artists'); window.scrollTo(0, 0)
  }

  async function saveWork() {
    if (!workForm.title || !workForm.artist_id) return flash('Title and artist are required')
    const certId = 'CERT-' + Math.random().toString(36).substr(2, 8).toUpperCase()
    const payload = {
      ...workForm,
      width_cm: Number(workForm.width_cm) || 0,
      height_cm: Number(workForm.height_cm) || 0,
      price: Number(workForm.price) || 0,
      status: 'available',
    }
    if (editingWork) {
      await sbUpdate('art_works', editingWork, payload)
      setEditingWork(null); flash('Work updated')
    } else {
      await sbInsert('art_works', { ...payload, cert_id: certId }); flash('Work added')
    }
    setWorkForm(emptyWork); loadData()
  }

  async function deleteWork(id: string) {
    if (!confirm('Delete this work?')) return
    await sbDelete('art_works', id); flash('Deleted'); loadData()
  }

  function editWork(w: Work) {
    setEditingWork(w.id)
    setWorkForm({
      artist_id: w.artist_id, title: w.title, description: w.description,
      medium: w.medium, width_cm: String(w.width_cm), height_cm: String(w.height_cm),
      year_created: String(w.year_created), price: String(w.price), image_url: w.image_url || ''
    })
    setTab('works'); window.scrollTo(0, 0)
  }

  async function updateStatus(id: string, status: string) {
    await sbUpdate('art_works', id, { status }); loadData()
  }

  async function printQRCodes() {
    const siteUrl = window.location.origin
    const win = window.open('', '_blank')
    if (!win) return
    const qrs: { url: string; title: string; artist: string }[] = []
    for (const w of works) {
      const dataUrl = await QRCode.toDataURL(`${siteUrl}/work/${w.id}`, { width: 200, margin: 2 })
      qrs.push({ url: dataUrl, title: w.title, artist: w.art_artists?.name || '' })
    }
    win.document.write(`<!DOCTYPE html><html><head><title>QR Codes</title>
      <style>body{font-family:serif;padding:20px}h1{text-align:center;margin-bottom:30px}
      .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
      .card{text-align:center;border:1px solid #ddd;padding:12px;page-break-inside:avoid}
      .card img{width:120px;height:120px}.title{font-size:11px;font-weight:bold;margin-top:6px}
      .artist{font-size:10px;color:#666}</style></head><body>
      <h1>Art Exhibition 2026 — QR Codes</h1><div class="grid">
      ${qrs.map(q => `<div class="card"><img src="${q.url}"/><div class="title">${q.title}</div><div class="artist">${q.artist}</div></div>`).join('')}
      </div><script>window.onload=()=>window.print()</script></body></html>`)
    win.document.close()
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="bg-white p-10 rounded-sm shadow-sm max-w-sm w-full">
          <h1 className="serif text-3xl font-light text-center mb-8">Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full border border-gray-200 rounded-sm px-4 py-3 mb-3 text-sm focus:outline-none focus:border-black"
            autoFocus
          />
          {pwError && <p className="text-red-500 text-xs mb-3">{pwError}</p>}
          <button onClick={login} className="w-full bg-black text-white py-3 text-sm hover:bg-gray-800 transition-colors rounded-sm">
            Enter
          </button>
        </div>
      </div>
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'works', label: 'Works' },
    { key: 'artists', label: 'Artists' },
    { key: 'orders', label: 'Orders' },
    { key: 'qrcodes', label: 'QR Codes' },
  ]

  const inp = 'w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-black'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="serif text-3xl font-light">Admin</h1>
        {msg && <div className="bg-green-50 text-green-700 text-sm px-4 py-2 rounded-sm">{msg}</div>}
      </div>

      <div className="flex gap-0 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tab === t.key ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="text-gray-400 text-sm py-4">Loading...</div>}

      {/* WORKS */}
      {tab === 'works' && (
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-sm">
            <h2 className="serif text-xl mb-4">{editingWork ? 'Edit Work' : 'Add Work'}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Artist</label>
                <select value={workForm.artist_id} onChange={e => setWorkForm({ ...workForm, artist_id: e.target.value })} className={inp}>
                  <option value="">Select Artist</option>
                  {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Title</label>
                <input value={workForm.title} onChange={e => setWorkForm({ ...workForm, title: e.target.value })} className={inp} placeholder="Artwork title" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Medium</label>
                <input value={workForm.medium} onChange={e => setWorkForm({ ...workForm, medium: e.target.value })} className={inp} placeholder="Oil on canvas, Watercolor..." />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Price (USD)</label>
                <input type="number" value={workForm.price} onChange={e => setWorkForm({ ...workForm, price: e.target.value })} className={inp} placeholder="500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Width (cm)</label>
                <input type="number" value={workForm.width_cm} onChange={e => setWorkForm({ ...workForm, width_cm: e.target.value })} className={inp} placeholder="60" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Height (cm)</label>
                <input type="number" value={workForm.height_cm} onChange={e => setWorkForm({ ...workForm, height_cm: e.target.value })} className={inp} placeholder="80" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Year</label>
                <input type="number" value={workForm.year_created} onChange={e => setWorkForm({ ...workForm, year_created: e.target.value })} className={inp} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Image URL</label>
                <input value={workForm.image_url} onChange={e => setWorkForm({ ...workForm, image_url: e.target.value })} className={inp} placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Description</label>
                <textarea value={workForm.description} onChange={e => setWorkForm({ ...workForm, description: e.target.value })} className={inp + ' h-20'} placeholder="About this work..." />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={saveWork} className="bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 rounded-sm">
                {editingWork ? 'Update' : 'Add Work'}
              </button>
              {editingWork && (
                <button onClick={() => { setEditingWork(null); setWorkForm(emptyWork) }} className="border border-gray-200 px-6 py-2 text-sm hover:border-black rounded-sm">
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="serif text-xl mb-4">All Works ({works.length})</h2>
            <div className="space-y-2">
              {works.map(w => (
                <div key={w.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-sm hover:border-gray-200">
                  {w.image_url && <img src={w.image_url} alt={w.title} className="w-12 h-12 object-cover rounded-sm flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{w.title}</p>
                    <p className="text-xs text-gray-400">{w.art_artists?.name} · ${w.price} · {w.medium}</p>
                  </div>
                  <select value={w.status} onChange={e => updateStatus(w.id, e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1 bg-white">
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                  <button onClick={() => editWork(w)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => deleteWork(w.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                </div>
              ))}
              {works.length === 0 && !loading && <p className="text-gray-400 text-sm serif italic">No works yet</p>}
            </div>
          </div>
        </div>
      )}

      {/* ARTISTS */}
      {tab === 'artists' && (
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-sm">
            <h2 className="serif text-xl mb-4">{editingArtist ? 'Edit Artist' : 'Add Artist'}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Name', ph: 'Full name' },
                { key: 'school', label: 'School', ph: 'University name' },
                { key: 'year', label: 'Graduation Year', ph: '2026' },
                { key: 'instagram', label: 'Instagram', ph: '@handle' },
                { key: 'photo_url', label: 'Photo URL', ph: 'https://...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">{f.label}</label>
                  <input value={artistForm[f.key as keyof typeof artistForm]} onChange={e => setArtistForm({ ...artistForm, [f.key]: e.target.value })} className={inp} placeholder={f.ph} />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide">Bio</label>
                <textarea value={artistForm.bio} onChange={e => setArtistForm({ ...artistForm, bio: e.target.value })} className={inp + ' h-20'} placeholder="Artist biography..." />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={saveArtist} className="bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 rounded-sm">
                {editingArtist ? 'Update' : 'Add Artist'}
              </button>
              {editingArtist && (
                <button onClick={() => { setEditingArtist(null); setArtistForm(emptyArtist) }} className="border border-gray-200 px-6 py-2 text-sm hover:border-black rounded-sm">
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="serif text-xl mb-4">All Artists ({artists.length})</h2>
            <div className="space-y-2">
              {artists.map(a => (
                <div key={a.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-sm hover:border-gray-200">
                  {a.photo_url && <img src={a.photo_url} alt={a.name} className="w-10 h-10 object-cover rounded-full flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.school} · Class of {a.year}</p>
                  </div>
                  <button onClick={() => editArtist(a)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => deleteArtist(a.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                </div>
              ))}
              {artists.length === 0 && !loading && <p className="text-gray-400 text-sm serif italic">No artists yet</p>}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div>
          <h2 className="serif text-xl mb-4">Orders ({orders.length})</h2>
          <div className="space-y-2">
            {orders.map(o => (
              <div key={o.id} className="p-4 border border-gray-100 rounded-sm">
                <div className="flex flex-wrap gap-4 justify-between">
                  <div>
                    <p className="font-medium text-sm">{o.buyer_name} — {o.buyer_email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{o.art_works?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${o.amount}</p>
                    <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{o.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && !loading && <p className="text-gray-400 text-sm serif italic">No orders yet</p>}
          </div>
        </div>
      )}

      {/* QR CODES */}
      {tab === 'qrcodes' && (
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="serif text-xl">QR Codes</h2>
              <p className="text-sm text-gray-400 mt-1">Print and place next to each physical artwork at the exhibition</p>
            </div>
            <button onClick={printQRCodes} className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800 transition-colors rounded-sm">
              Print All QR Codes ({works.length})
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {works.map(w => (
              <div key={w.id} className="border border-gray-100 p-3 text-center rounded-sm">
                <QRPreview workId={w.id} />
                <p className="text-xs font-medium mt-2 leading-tight line-clamp-2">{w.title}</p>
                <p className="text-xs text-gray-400">{w.art_artists?.name}</p>
              </div>
            ))}
            {works.length === 0 && <p className="text-gray-400 text-sm col-span-full serif italic">No works yet — add works first</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function QRPreview({ workId }: { workId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvasRef.current) {
      const url = `${window.location.origin}/work/${workId}`
      QRCode.toCanvas(canvasRef.current, url, { width: 80, margin: 1 })
    }
  }, [workId])
  return <canvas ref={canvasRef} className="mx-auto" />
}

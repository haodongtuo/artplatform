import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

async function get(path: string) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HDR, cache: 'no-store' })
  return r.ok ? r.json() : []
}

const s = {
  page: { padding: '32px 16px', maxWidth: '960px', margin: '0 auto' } as React.CSSProperties,
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' } as React.CSSProperties,
  h1: { fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 300, margin: 0 } as React.CSSProperties,
  meta: { fontSize: '13px', color: '#999', marginTop: '4px' } as React.CSSProperties,
  h2: { fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, marginBottom: '14px' } as React.CSSProperties,
  section: { background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px', marginBottom: '24px' } as React.CSSProperties,
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' } as React.CSSProperties,
  stat: { background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '20px', textAlign: 'center' } as React.CSSProperties,
  statNum: { fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#d97706' } as React.CSSProperties,
  statLabel: { fontSize: '12px', color: '#999', marginTop: '4px' } as React.CSSProperties,
  label: { fontSize: '11px', color: '#888', textTransform: 'uppercase' as const, display: 'block', marginBottom: '4px', marginTop: '12px' },
  input: { width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' as const },
  textarea: { width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', height: '80px', resize: 'vertical' as const, boxSizing: 'border-box' as const },
  select: { width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' as const },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } as React.CSSProperties,
  full: { gridColumn: '1/-1' } as React.CSSProperties,
  btn: { background: '#111', color: 'white', border: 'none', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', marginTop: '16px' } as React.CSSProperties,
  btnOutline: { background: 'white', color: '#111', border: '1px solid #ddd', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px' } as React.CSSProperties,
  row: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '4px', marginBottom: '8px' } as React.CSSProperties,
  badge: { fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: '#f0f0f0', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  badgeSold: { fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: '#fee2e2', color: '#991b1b', whiteSpace: 'nowrap' as const } as React.CSSProperties,
}

export default async function SchoolDashboard() {
  const cookieStore = await cookies()
  const raw = cookieStore.get('school_admin_auth')?.value
  if (!raw) redirect('/school-admin')

  const admin = JSON.parse(raw)
  const { exhibition_id } = admin

  const [exhibition, artists, works, orders] = await Promise.all([
    fetch(`${SB_URL}/rest/v1/exhibitions?id=eq.${exhibition_id}&select=*`, { headers: HDR, cache: 'no-store' })
      .then(r => r.json()).then(d => d[0]),
    get(`art_artists?exhibition_id=eq.${exhibition_id}&order=created_at.desc&select=*`),
    get(`art_works?exhibition_id=eq.${exhibition_id}&order=created_at.desc&select=*,art_artists(name)`),
    get(`art_orders?select=*,art_works(title,exhibition_id)&order=created_at.desc`),
  ])

  const myOrders = (orders as any[]).filter((o: any) => o.art_works?.exhibition_id === exhibition_id)

  return (
    <div style={s.page}>
      {/* Topbar */}
      <div style={s.topbar}>
        <div>
          <h1 style={s.h1}>{exhibition?.name || 'My Exhibition'}</h1>
          <p style={s.meta}>
            {exhibition?.school} · {exhibition?.city}
            {exhibition?.date ? ` · ${new Date(exhibition.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}
            &nbsp;·&nbsp;
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: exhibition?.status === 'active' ? '#d1fae5' : '#fef3c7', color: exhibition?.status === 'active' ? '#065f46' : '#92400e' }}>
              {exhibition?.status}
            </span>
          </p>
        </div>
        <form method="POST" action="/api/school-logout">
          <button style={s.btnOutline}>Logout</button>
        </form>
      </div>

      {/* Stats */}
      <div style={s.stats}>
        {[
          { num: (artists as any[]).length, label: 'Artists' },
          { num: (works as any[]).length, label: 'Works' },
          { num: myOrders.length, label: 'Orders' },
        ].map(item => (
          <div key={item.label} style={s.stat}>
            <div style={s.statNum}>{item.num}</div>
            <div style={s.statLabel}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Add Artist */}
      <div style={s.section}>
        <h2 style={s.h2}>Add Artist + Login Account</h2>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>Fill in email and password — the artist can log in with these credentials.</p>
        <form method="POST" action="/api/admin-create-artist-account">
          <input type="hidden" name="exhibition_id" value={exhibition_id} />
          <div style={{ ...s.grid2, marginBottom: '0' }}>
            <div>
              <label style={s.label}>Login Email *</label>
              <input style={s.input} name="email" type="email" required placeholder="artist@email.com" />
            </div>
            <div>
              <label style={s.label}>Initial Password *</label>
              <input style={s.input} name="password" type="text" required placeholder="Min 6 characters" />
            </div>
          </div>
          <div style={s.grid2}>
            <div style={s.full}>
              <label style={s.label}>Name *</label>
              <input style={s.input} name="name" required />
            </div>
            <div>
              <label style={s.label}>School</label>
              <input style={s.input} name="school" defaultValue={exhibition?.school} />
            </div>
            <div>
              <label style={s.label}>Year</label>
              <input style={s.input} name="year" defaultValue="2026" />
            </div>
            <div style={s.full}>
              <label style={s.label}>Bio</label>
              <textarea style={s.textarea} name="bio" />
            </div>
            <div>
              <label style={s.label}>Photo URL</label>
              <input style={s.input} name="photo_url" />
            </div>
            <div>
              <label style={s.label}>Instagram</label>
              <input style={s.input} name="instagram" />
            </div>
          </div>
          <button style={s.btn} type="submit">Save Artist + Create Login</button>
        </form>
      </div>

      {/* Add Work */}
      <div style={s.section}>
        <h2 style={s.h2}>Add Work</h2>
        <form method="POST" action="/api/admin-work">
          <input type="hidden" name="exhibition_id" value={exhibition_id} />
          <div style={s.grid2}>
            <div>
              <label style={s.label}>Artist *</label>
              <select style={s.select} name="artist_id" required>
                <option value="">Select artist…</option>
                {(artists as any[]).map((a: any) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={s.label}>Title *</label>
              <input style={s.input} name="title" required />
            </div>
            <div style={s.full}>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} name="description" />
            </div>
            <div>
              <label style={s.label}>Medium</label>
              <input style={s.input} name="medium" />
            </div>
            <div>
              <label style={s.label}>Year Created</label>
              <input style={s.input} name="year_created" defaultValue="2026" />
            </div>
            <div>
              <label style={s.label}>Width (cm)</label>
              <input style={s.input} name="width_cm" type="number" />
            </div>
            <div>
              <label style={s.label}>Height (cm)</label>
              <input style={s.input} name="height_cm" type="number" />
            </div>
            <div>
              <label style={s.label}>Price (USD)</label>
              <input style={s.input} name="price" type="number" defaultValue="521" />
            </div>
            <div style={s.full}>
              <label style={s.label}>Image URL</label>
              <input style={s.input} name="image_url" />
            </div>
          </div>
          <button style={s.btn} type="submit">Save Work</button>
        </form>
      </div>

      {/* Artists List */}
      <div style={s.section}>
        <h2 style={s.h2}>Artists ({(artists as any[]).length})</h2>
        {(artists as any[]).length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No artists yet.</p>}
        {(artists as any[]).map((a: any) => (
          <div style={s.row} key={a.id}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{a.name}</p>
              <small style={{ color: '#999', fontSize: '12px' }}>{a.school} · {a.year}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Works List */}
      <div style={s.section}>
        <h2 style={s.h2}>Works ({(works as any[]).length})</h2>
        {(works as any[]).length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No works yet.</p>}
        {(works as any[]).map((w: any) => (
          <div style={s.row} key={w.id}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{w.title}</p>
              <small style={{ color: '#999', fontSize: '12px' }}>{w.art_artists?.name} · {w.medium} · ${w.price}</small>
            </div>
            <span style={w.status === 'sold' ? s.badgeSold : s.badge}>{w.status}</span>
            <a href={`/work/${w.id}/print`} target="_blank" style={{ fontSize: '12px', color: '#d97706', textDecoration: 'none', whiteSpace: 'nowrap' }}>🖨️ Print QR</a>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div style={s.section}>
        <h2 style={s.h2}>Orders ({myOrders.length})</h2>
        {myOrders.length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No orders yet.</p>}
        {myOrders.map((o: any) => (
          <div style={s.row} key={o.id}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{o.art_works?.title}</p>
              <small style={{ color: '#999', fontSize: '12px' }}>{o.buyer_name} · {o.buyer_email} · ${o.amount}</small>
            </div>
            <span style={s.badge}>{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

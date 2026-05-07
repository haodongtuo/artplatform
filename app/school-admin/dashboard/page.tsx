import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

async function get(path: string) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HDR, cache: 'no-store' })
  return r.ok ? r.json() : []
}

export default async function SchoolDashboard() {
  const cookieStore = await cookies()
  const raw = cookieStore.get('school_admin_auth')?.value
  if (!raw) redirect('/school-admin')

  const admin = JSON.parse(raw)
  const { exhibition_id } = admin

  // 只拉本展览的数据
  const [exhibition, artists, works, orders] = await Promise.all([
    fetch(`${SB_URL}/rest/v1/exhibitions?id=eq.${exhibition_id}&select=*`, { headers: HDR, cache: 'no-store' })
      .then(r => r.json()).then(d => d[0]),
    get(`art_artists?exhibition_id=eq.${exhibition_id}&order=created_at.desc&select=*`),
    get(`art_works?exhibition_id=eq.${exhibition_id}&order=created_at.desc&select=*,art_artists(name)`),
    get(`art_orders?select=*,art_works(title,exhibition_id)&order=created_at.desc`),
  ])

  // 过滤订单：只显示本展览的作品
  const myOrders = (orders as any[]).filter((o: any) =>
    o.art_works?.exhibition_id === exhibition_id
  )

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{exhibition?.name || 'School Admin'} — Dashboard</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, sans-serif; background: #f9fafb; color: #111; padding: 32px 16px; }
          .main { max-width: 960px; margin: 0 auto; }
          .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
          h1 { font-family: Georgia, serif; font-size: 24px; font-weight: 300; }
          .meta { font-size: 13px; color: #999; margin-top: 4px; }
          h2 { font-family: Georgia, serif; font-size: 18px; font-weight: 400; margin-bottom: 14px; }
          .section { background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
          .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
          .stat { background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; text-align: center; }
          .stat-num { font-family: Georgia, serif; font-size: 32px; font-weight: 300; color: #d97706; }
          .stat-label { font-size: 12px; color: #999; margin-top: 4px; }
          label { font-size: 11px; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px; margin-top: 12px; }
          input, select, textarea { width: 100%; border: 1px solid #e5e5e5; border-radius: 4px; padding: 8px 12px; font-size: 14px; }
          textarea { height: 80px; resize: vertical; }
          .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .full { grid-column: 1/-1; }
          .btn { background: #111; color: white; border: none; padding: 10px 20px; font-size: 13px; cursor: pointer; border-radius: 4px; margin-top: 16px; }
          .btn-outline { background: white; color: #111; border: 1px solid #ddd; padding: 8px 16px; font-size: 13px; cursor: pointer; border-radius: 4px; }
          .row { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #f0f0f0; border-radius: 4px; margin-bottom: 8px; }
          .row p { margin: 0; font-size: 14px; font-weight: 500; }
          .row small { color: #999; font-size: 12px; }
          .badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; background: #f0f0f0; white-space: nowrap; }
          .badge.active { background: #d1fae5; color: #065f46; }
          .badge.upcoming { background: #fef3c7; color: #92400e; }
          .badge.sold { background: #fee2e2; color: #991b1b; }
        `}</style>
      </head>
      <body>
        <div className="main">
          <div className="topbar">
            <div>
              <h1>{exhibition?.name || 'My Exhibition'}</h1>
              <p className="meta">
                {exhibition?.school} · {exhibition?.city}
                {exhibition?.date ? ` · ${new Date(exhibition.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}
                &nbsp;·&nbsp;
                <span className={`badge ${exhibition?.status}`}>{exhibition?.status}</span>
              </p>
            </div>
            <form method="POST" action="/api/school-logout">
              <button className="btn-outline">Logout</button>
            </form>
          </div>

          {/* Stats */}
          <div className="stats">
            <div className="stat">
              <div className="stat-num">{(artists as any[]).length}</div>
              <div className="stat-label">Artists</div>
            </div>
            <div className="stat">
              <div className="stat-num">{(works as any[]).length}</div>
              <div className="stat-label">Works</div>
            </div>
            <div className="stat">
              <div className="stat-num">{myOrders.length}</div>
              <div className="stat-label">Orders</div>
            </div>
          </div>

          {/* Add Artist */}
          <div className="section">
            <h2>Add Artist</h2>
            <form method="POST" action="/api/admin-artist">
              <input type="hidden" name="exhibition_id" value={exhibition_id} />
              <div className="grid2">
                <div className="full">
                  <label>Name *</label>
                  <input name="name" required />
                </div>
                <div>
                  <label>School</label>
                  <input name="school" defaultValue={exhibition?.school} />
                </div>
                <div>
                  <label>Year</label>
                  <input name="year" defaultValue="2026" />
                </div>
                <div className="full">
                  <label>Bio</label>
                  <textarea name="bio" />
                </div>
                <div>
                  <label>Photo URL</label>
                  <input name="photo_url" />
                </div>
                <div>
                  <label>Instagram</label>
                  <input name="instagram" />
                </div>
              </div>
              <button className="btn" type="submit">Save Artist</button>
            </form>
          </div>

          {/* Add Work */}
          <div className="section">
            <h2>Add Work</h2>
            <form method="POST" action="/api/admin-work">
              <input type="hidden" name="exhibition_id" value={exhibition_id} />
              <div className="grid2">
                <div>
                  <label>Artist *</label>
                  <select name="artist_id" required>
                    <option value="">Select artist…</option>
                    {(artists as any[]).map((a: any) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Title *</label>
                  <input name="title" required />
                </div>
                <div className="full">
                  <label>Description</label>
                  <textarea name="description" />
                </div>
                <div>
                  <label>Medium</label>
                  <input name="medium" />
                </div>
                <div>
                  <label>Year Created</label>
                  <input name="year_created" defaultValue="2026" />
                </div>
                <div>
                  <label>Width (cm)</label>
                  <input name="width_cm" type="number" />
                </div>
                <div>
                  <label>Height (cm)</label>
                  <input name="height_cm" type="number" />
                </div>
                <div>
                  <label>Price (USD)</label>
                  <input name="price" type="number" defaultValue="521" />
                </div>
                <div className="full">
                  <label>Image URL</label>
                  <input name="image_url" />
                </div>
              </div>
              <button className="btn" type="submit">Save Work</button>
            </form>
          </div>

          {/* Artists List */}
          <div className="section">
            <h2>Artists ({(artists as any[]).length})</h2>
            {(artists as any[]).length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No artists yet.</p>}
            {(artists as any[]).map((a: any) => (
              <div className="row" key={a.id}>
                <div style={{ flex: 1 }}>
                  <p>{a.name}</p>
                  <small>{a.school} · {a.year}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Works List */}
          <div className="section">
            <h2>Works ({(works as any[]).length})</h2>
            {(works as any[]).length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No works yet.</p>}
            {(works as any[]).map((w: any) => (
              <div className="row" key={w.id}>
                <div style={{ flex: 1 }}>
                  <p>{w.title}</p>
                  <small>{w.art_artists?.name} · {w.medium} · ${w.price}</small>
                </div>
                <span className={`badge ${w.status === 'sold' ? 'sold' : ''}`}>{w.status}</span>
                <a href={`/work/${w.id}/print`} target="_blank" style={{ fontSize: '12px', color: '#d97706', textDecoration: 'none', whiteSpace: 'nowrap' }}>🖨️ Print QR</a>
              </div>
            ))}
          </div>

          {/* Orders */}
          <div className="section">
            <h2>Orders ({myOrders.length})</h2>
            {myOrders.length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No orders yet.</p>}
            {myOrders.map((o: any) => (
              <div className="row" key={o.id}>
                <div style={{ flex: 1 }}>
                  <p>{o.art_works?.title}</p>
                  <small>{o.buyer_name} · {o.buyer_email} · ${o.amount}</small>
                </div>
                <span className="badge">{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      </body>
    </html>
  )
}

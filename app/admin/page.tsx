import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const PWD = 'art2026admin'
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

async function get(table: string, select = '*', extra = '') {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?select=${select}&order=created_at.desc${extra}`, { headers: HDR, cache: 'no-store' })
  return r.ok ? r.json() : []
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const sp = await searchParams
  const cookieStore = await cookies()
  const authed = cookieStore.get('admin_auth')?.value === '1'

  if (!authed) {
    return (
      <html>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Admin Login</title>
          <style>{`
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, sans-serif; background: #f9fafb; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.1); width: 320px; }
            h1 { font-family: Georgia, serif; font-size: 28px; font-weight: 300; text-align: center; margin-bottom: 24px; }
            input { width: 100%; border: 1px solid #ddd; border-radius: 4px; padding: 10px 14px; font-size: 14px; margin-bottom: 8px; }
            button { width: 100%; background: #111; color: white; border: none; padding: 12px; font-size: 14px; cursor: pointer; border-radius: 4px; }
            .err { color: red; font-size: 12px; margin-bottom: 8px; }
          `}</style>
        </head>
        <body>
          <div className="card">
            <h1>Admin</h1>
            <form method="POST" action="/api/admin-auth">
              <input type="password" name="password" placeholder="Password" autoFocus />
              {sp.err && <p className="err">Wrong password</p>}
              <button type="submit">Enter</button>
            </form>
          </div>
        </body>
      </html>
    )
  }

  const [artists, works, orders, exhibitions, schoolAdmins] = await Promise.all([
    get('art_artists'),
    get('art_works', '*,art_artists(name)'),
    get('art_orders', '*,art_works(title)'),
    get('exhibitions'),
    get('school_admins', 'id,email,role,exhibition_id,created_at,exhibitions(name)', '&'),
  ])

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Super Admin — Before They Rise</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, sans-serif; background: #f9fafb; color: #111; padding: 32px 16px; }
          .main { max-width: 960px; margin: 0 auto; }
          h1 { font-family: Georgia, serif; font-size: 28px; font-weight: 300; margin-bottom: 4px; }
          .subtitle { font-size: 13px; color: #d97706; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 32px; }
          h2 { font-family: Georgia, serif; font-size: 20px; font-weight: 400; margin-bottom: 16px; }
          .section { background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
          .section-highlight { background: white; border: 2px solid #fde68a; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
          label { font-size: 11px; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px; margin-top: 12px; }
          input, select, textarea { width: 100%; border: 1px solid #e5e5e5; border-radius: 4px; padding: 8px 12px; font-size: 14px; }
          textarea { height: 80px; resize: vertical; }
          .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
          .full { grid-column: 1/-1; }
          .btn { background: #111; color: white; border: none; padding: 10px 20px; font-size: 13px; cursor: pointer; border-radius: 4px; margin-top: 16px; }
          .btn-amber { background: #d97706; color: white; border: none; padding: 10px 20px; font-size: 13px; cursor: pointer; border-radius: 4px; margin-top: 16px; }
          .btn-outline { background: white; color: #111; border: 1px solid #ddd; padding: 8px 16px; font-size: 13px; cursor: pointer; border-radius: 4px; }
          .row { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #f0f0f0; border-radius: 4px; margin-bottom: 8px; }
          .row p { margin: 0; font-size: 14px; font-weight: 500; }
          .row small { color: #999; font-size: 12px; }
          .badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; background: #f0f0f0; white-space: nowrap; }
          .badge.active { background: #d1fae5; color: #065f46; }
          .badge.upcoming { background: #fef3c7; color: #92400e; }
          .badge.closed { background: #f3f4f6; color: #6b7280; }
          .divider { height: 1px; background: #f0f0f0; margin: 24px 0; }
          .tag { font-size: 11px; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; }
        `}</style>
      </head>
      <body>
        <div className="main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h1>Before They Rise</h1>
              <p className="subtitle">Super Admin</p>
            </div>
            <form method="POST" action="/api/admin-logout">
              <button className="btn-outline">Logout</button>
            </form>
          </div>

          {/* ── EXHIBITIONS ── */}
          <div className="section-highlight">
            <h2>🌍 Exhibitions</h2>
            {(exhibitions as any[]).map((ex: any) => (
              <div className="row" key={ex.id}>
                <div style={{ flex: 1 }}>
                  <p>{ex.name}</p>
                  <small>{ex.school} · {ex.city}, {ex.country} {ex.date ? `· ${ex.date}` : ''}</small>
                </div>
                <span className={`badge ${ex.status}`}>{ex.status}</span>
                <code style={{ fontSize: '11px', color: '#999' }}>/exhibition/{ex.slug}</code>
              </div>
            ))}

            <div className="divider" />
            <h2 style={{ fontSize: '15px', marginBottom: '12px' }}>Create New Exhibition</h2>
            <form method="POST" action="/api/admin-exhibition">
              <div className="grid3">
                <div>
                  <label>Exhibition Name *</label>
                  <input name="name" placeholder="UCLA Graduation 2027" required />
                </div>
                <div>
                  <label>School Name *</label>
                  <input name="school" placeholder="UCLA" required />
                </div>
                <div>
                  <label>Slug * (URL)</label>
                  <input name="slug" placeholder="ucla-2027" required />
                </div>
                <div>
                  <label>City *</label>
                  <input name="city" placeholder="Los Angeles" required />
                </div>
                <div>
                  <label>Country</label>
                  <input name="country" defaultValue="US" />
                </div>
                <div>
                  <label>Exhibition Date</label>
                  <input name="date" type="date" />
                </div>
                <div>
                  <label>Status</label>
                  <select name="status">
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label>Cover Image URL</label>
                  <input name="cover_image" placeholder="https://…" />
                </div>
                <div className="full">
                  <label>Description</label>
                  <textarea name="description" />
                </div>
              </div>
              <button className="btn-amber" type="submit">Create Exhibition</button>
            </form>
          </div>

          {/* ── SCHOOL ADMINS ── */}
          <div className="section-highlight">
            <h2>🔑 School Admin Accounts</h2>
            {(schoolAdmins as any[]).map((a: any) => (
              <div className="row" key={a.id}>
                <div style={{ flex: 1 }}>
                  <p>{a.email}</p>
                  <small>{(a as any).exhibitions?.name || a.exhibition_id}</small>
                </div>
                <span className="badge">{a.role}</span>
              </div>
            ))}

            <div className="divider" />
            <h2 style={{ fontSize: '15px', marginBottom: '12px' }}>Create School Admin Account</h2>
            <form method="POST" action="/api/admin-school-account">
              <div className="grid3">
                <div>
                  <label>Email *</label>
                  <input name="email" type="email" required />
                </div>
                <div>
                  <label>Password *</label>
                  <input name="password" type="text" placeholder="Set a strong password" required />
                </div>
                <div>
                  <label>Exhibition *</label>
                  <select name="exhibition_id" required>
                    <option value="">Select exhibition…</option>
                    {(exhibitions as any[]).map((ex: any) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="btn-amber" type="submit">Create Account</button>
            </form>
          </div>

          {/* ── ARTISTS ── */}
          <div className="section">
            <h2>Add Artist (LA 2026)</h2>
            <form method="POST" action="/api/admin-artist">
              <input type="hidden" name="exhibition_id" value={(exhibitions as any[]).find((e: any) => e.slug === 'la-graduation-2026')?.id || ''} />
              <div className="grid2">
                <div className="full">
                  <label>Name *</label>
                  <input name="name" required />
                </div>
                <div>
                  <label>School</label>
                  <input name="school" />
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

          {/* ── WORKS ── */}
          <div className="section">
            <h2>Add Work (LA 2026)</h2>
            <form method="POST" action="/api/admin-work">
              <input type="hidden" name="exhibition_id" value={(exhibitions as any[]).find((e: any) => e.slug === 'la-graduation-2026')?.id || ''} />
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

          {/* ── ARTISTS LIST ── */}
          <div className="section">
            <h2>All Artists ({(artists as any[]).length})</h2>
            {(artists as any[]).length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No artists yet.</p>}
            {(artists as any[]).map((a: any) => (
              <div className="row" key={a.id}>
                <div style={{ flex: 1 }}>
                  <p>{a.name}</p>
                  <small>{a.school} {a.year}</small>
                </div>
              </div>
            ))}
          </div>

          {/* ── WORKS LIST ── */}
          <div className="section">
            <h2>All Works ({(works as any[]).length})</h2>
            {(works as any[]).length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No works yet.</p>}
            {(works as any[]).map((w: any) => (
              <div className="row" key={w.id}>
                <div style={{ flex: 1 }}>
                  <p>{w.title}</p>
                  <small>{w.art_artists?.name} · {w.medium} · ${w.price}</small>
                </div>
                <span className="badge">{w.status}</span>
                <a href={`/work/${w.id}/print`} target="_blank" style={{ fontSize: '12px', color: '#d97706', textDecoration: 'none', whiteSpace: 'nowrap' }}>🖨️ Print QR</a>
              </div>
            ))}
          </div>

          {/* ── ORDERS ── */}
          <div className="section">
            <h2>All Orders ({(orders as any[]).length})</h2>
            {(orders as any[]).length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No orders yet.</p>}
            {(orders as any[]).map((o: any) => (
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

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const PWD = 'art2026admin'
const SB_URL = 'https://mymezahwaaxunxaxqshe.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjAwNDMsImV4cCI6MjA4OTMzNjA0M30.NKq1a9aD3QT2m3T5Sz8SWCYfivXBrGMEUiG0GRJL_cQ'
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

async function get(table: string, select = '*') {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?select=${select}&order=created_at.desc`, { headers: HDR, cache: 'no-store' })
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

  // Logged in — load data
  const [artists, works, orders] = await Promise.all([
    get('art_artists'),
    get('art_works', '*,art_artists(name)'),
    get('art_orders', '*,art_works(title)'),
  ])

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin — Art Exhibition 2026</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, sans-serif; background: #f9fafb; color: #111; padding: 32px 16px; }
          .main { max-width: 960px; margin: 0 auto; }
          h1 { font-family: Georgia, serif; font-size: 28px; font-weight: 300; margin-bottom: 32px; }
          h2 { font-family: Georgia, serif; font-size: 20px; font-weight: 400; margin-bottom: 16px; }
          h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #555; }
          .section { background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
          label { font-size: 11px; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px; margin-top: 12px; }
          input, select, textarea { width: 100%; border: 1px solid #e5e5e5; border-radius: 4px; padding: 8px 12px; font-size: 14px; }
          textarea { height: 80px; resize: vertical; }
          .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .full { grid-column: 1/-1; }
          .btn { background: #111; color: white; border: none; padding: 10px 20px; font-size: 13px; cursor: pointer; border-radius: 4px; margin-top: 16px; }
          .row { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #f0f0f0; border-radius: 4px; margin-bottom: 8px; }
          .row p { margin: 0; font-size: 14px; font-weight: 500; }
          .row small { color: #999; font-size: 12px; }
          .badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; background: #f0f0f0; }
          a.logout { font-size: 13px; color: #999; text-decoration: none; float: right; margin-top: 8px; }
        `}</style>
      </head>
      <body>
        <div className="main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <h1>Admin — Art Exhibition 2026</h1>
            <form method="POST" action="/api/admin-logout">
              <button className="btn" style={{ background: '#fff', color: '#111', border: '1px solid #ddd', marginTop: 0 }}>Logout</button>
            </form>
          </div>

          {/* Add Artist */}
          <div className="section">
            <h2>Add Artist</h2>
            <form method="POST" action="/api/admin-artist">
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

          {/* Add Work */}
          <div className="section">
            <h2>Add Work</h2>
            <form method="POST" action="/api/admin-work">
              <div className="grid2">
                <div>
                  <label>Artist *</label>
                  <select name="artist_id" required>
                    <option value="">Select artist…</option>
                    {artists.map((a: any) => (
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
                  <input name="price" type="number" />
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
            <h2>Artists ({artists.length})</h2>
            {artists.length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No artists yet.</p>}
            {artists.map((a: any) => (
              <div className="row" key={a.id}>
                <div style={{ flex: 1 }}>
                  <p>{a.name}</p>
                  <small>{a.school} {a.year}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Works List */}
          <div className="section">
            <h2>Works ({works.length})</h2>
            {works.length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No works yet.</p>}
            {works.map((w: any) => (
              <div className="row" key={w.id}>
                <div style={{ flex: 1 }}>
                  <p>{w.title}</p>
                  <small>{w.art_artists?.name} · {w.medium} · ${w.price}</small>
                </div>
                <span className="badge">{w.status}</span>
              </div>
            ))}
          </div>

          {/* Orders List */}
          <div className="section">
            <h2>Orders ({orders.length})</h2>
            {orders.length === 0 && <p style={{ color: '#999', fontSize: '14px' }}>No orders yet.</p>}
            {orders.map((o: any) => (
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

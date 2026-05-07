export default async function SchoolAdminLogin({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const sp = await searchParams

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>School Admin Login — Before They Rise</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, sans-serif; background: #f9fafb; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
          .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.1); width: 360px; }
          .logo { font-family: Georgia, serif; font-size: 13px; color: #d97706; text-align: center; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px; }
          h1 { font-family: Georgia, serif; font-size: 24px; font-weight: 300; text-align: center; margin-bottom: 6px; }
          .sub { font-size: 13px; color: #999; text-align: center; margin-bottom: 28px; }
          label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px; margin-top: 16px; }
          input { width: 100%; border: 1px solid #ddd; border-radius: 4px; padding: 10px 14px; font-size: 14px; }
          button { width: 100%; background: #111; color: white; border: none; padding: 12px; font-size: 14px; cursor: pointer; border-radius: 4px; margin-top: 20px; }
          .err { color: #dc2626; font-size: 12px; margin-top: 10px; text-align: center; }
          .super-link { display: block; text-align: center; margin-top: 20px; font-size: 12px; color: #bbb; text-decoration: none; }
          .super-link:hover { color: #888; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <p className="logo">Before They Rise</p>
          <h1>School Admin</h1>
          <p className="sub">Log in to manage your exhibition</p>
          <form method="POST" action="/api/school-auth">
            <label>Email</label>
            <input type="email" name="email" placeholder="your@school.edu" autoFocus required />
            <label>Password</label>
            <input type="password" name="password" required />
            {sp.err && <p className="err">Incorrect email or password</p>}
            <button type="submit">Log In</button>
          </form>
          <a href="/admin" className="super-link">Super Admin →</a>
        </div>
      </body>
    </html>
  )
}

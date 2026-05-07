export default async function SchoolAdminLogin({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const sp = await searchParams

  return (
    <div style={{ fontFamily: '-apple-system, sans-serif', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,.1)', width: '360px' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#d97706', textAlign: 'center', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Before They Rise
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 300, textAlign: 'center', marginBottom: '6px' }}>
          School Admin
        </h1>
        <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', marginBottom: '28px' }}>
          Log in to manage your exhibition
        </p>
        <form method="POST" action="/api/school-auth">
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@school.edu"
              autoFocus
              required
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Password</label>
            <input
              type="password"
              name="password"
              required
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          {sp.err && (
            <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '8px', textAlign: 'center' }}>
              Incorrect email or password
            </p>
          )}
          <button
            type="submit"
            style={{ width: '100%', background: '#111', color: 'white', border: 'none', padding: '12px', fontSize: '14px', cursor: 'pointer', borderRadius: '4px', marginTop: '8px' }}
          >
            Log In
          </button>
        </form>
        <a href="/admin" style={{ display: 'block', textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#bbb', textDecoration: 'none' }}>
          Super Admin →
        </a>
      </div>
    </div>
  )
}

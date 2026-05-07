import type { Metadata, Viewport } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Art Exhibition 2026 | University Graduation Show',
  description: 'University Art Graduation Exhibition — May 21, 2026. Original works by graduating students, available for direct purchase.',
  openGraph: {
    title: 'Art Exhibition 2026',
    description: 'University Art Graduation Exhibition — May 21, 2026',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <footer style={{ background: '#f5f5f0', borderTop: '1px solid #e5e7eb', padding: '56px 24px 32px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
              <div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Before They Rise</p>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>A home for emerging artists.<br />A future for original art.</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111', marginBottom: '14px' }}>Explore</p>
                {[['Artworks', '/gallery'], ['Artists', '/#artists'], ['Exhibitions', '/exhibition/la-graduation-2026']].map(([label, href]) => (
                  <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: '#666', textDecoration: 'none', marginBottom: '8px' }}>{label}</a>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111', marginBottom: '14px' }}>Support</p>
                {[['About Us', '/about'], ['How It Works', '/about'], ['Artist Login', '/login']].map(([label, href]) => (
                  <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: '#666', textDecoration: 'none', marginBottom: '8px' }}>{label}</a>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111', marginBottom: '14px' }}>Connect</p>
                {[['Instagram', '#'], ['TikTok', '#'], ['Contact', '/about']].map(([label, href]) => (
                  <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: '#666', textDecoration: 'none', marginBottom: '8px' }}>{label}</a>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>© 2026 Before They Rise. All rights reserved.</p>
              <div style={{ display: 'flex', gap: '24px' }}>
                {['Terms', 'Privacy'].map(t => (
                  <a key={t} href="#" style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}>{t}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

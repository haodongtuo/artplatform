import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import WorkCard from '@/components/WorkCard'
import Image from 'next/image'

export const revalidate = 60

async function getFeaturedWorks() {
  const { data } = await supabase
    .from('art_works')
    .select('*, art_artists(*)')
    .eq('status', 'available')
    .limit(4)
    .order('created_at', { ascending: false })
  return data || []
}

async function getNewArtists() {
  const { data } = await supabase
    .from('art_artists')
    .select('*')
    .limit(4)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function Home() {
  const [works, newArtists] = await Promise.all([getFeaturedWorks(), getNewArtists()])

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: '#f5f5f0', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>

          {/* Left */}
          <div>
            <div style={{ display: 'inline-block', background: '#e8e4f0', color: '#6b5fa0', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '28px' }}>
              A Home for Emerging Artists
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(42px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.05, color: '#111', margin: '0 0 8px' }}>
              Discover<br />tomorrow's<br />artists
            </h1>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(38px, 5.5vw, 62px)', fontWeight: 400, fontStyle: 'italic', color: '#d97706', lineHeight: 1.1, margin: '0 0 28px', position: 'relative' }}>
              before the<br />gallery does.
              {/* underline accent */}
              <span style={{ display: 'block', height: '3px', background: '#d97706', borderRadius: '2px', marginTop: '6px', width: '80%' }} />
            </p>
            <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.7, maxWidth: '360px', marginBottom: '36px' }}>
              Collect original works from emerging university artists. Every purchase supports the artist who made it.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#111', color: 'white', padding: '14px 28px', borderRadius: '40px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                Explore Artworks <span>→</span>
              </Link>
              <Link href="/#artists" style={{ fontSize: '14px', color: '#111', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: '2px' }}>
                Meet the Artists
              </Link>
            </div>
          </div>

          {/* Right — decorative collage */}
          <div style={{ position: 'relative', height: '480px' }}>
            {/* Main circle stamp */}
            <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '110px', height: '110px', borderRadius: '50%', border: '1.5px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', color: '#6b5fa0' }}>✳</div>
                <div style={{ fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', lineHeight: 1.8 }}>Emerging Today<br />Collect Tomorrow</div>
              </div>
            </div>
            {/* Paint splash blobs */}
            <div style={{ position: 'absolute', top: 0, right: '10%', width: '160px', height: '120px', background: 'linear-gradient(135deg, #fbbf24 0%, #f87171 100%)', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', opacity: 0.35, zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '40px', right: '20%', width: '100px', height: '80px', background: '#a78bfa', borderRadius: '40% 60% 30% 70% / 60% 30% 70% 40%', opacity: 0.25, zIndex: 0 }} />
            {/* Artist photo placeholder */}
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '280px', height: '360px', background: 'linear-gradient(160deg, #e5e7eb 0%, #d1d5db 100%)', borderRadius: '12px', overflow: 'hidden', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎨</div>
                <div style={{ fontSize: '12px' }}>Artist at work</div>
              </div>
            </div>
            {/* Small sketch thumbnail */}
            <div style={{ position: 'absolute', bottom: '60px', right: '4%', width: '90px', height: '110px', background: '#f3f4f6', borderRadius: '8px', border: '1px solid #e5e7eb', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <span style={{ fontSize: '28px' }}>✏️</span>
            </div>
            {/* Yellow dot */}
            <div style={{ position: 'absolute', top: '180px', left: '8%', width: '14px', height: '14px', borderRadius: '50%', background: '#fbbf24', zIndex: 2 }} />
          </div>
        </div>
      </section>

      {/* ── FEATURED ARTWORKS ── */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 700, color: '#111', margin: 0 }}>Featured Artworks</h2>
            <Link href="/gallery" style={{ fontSize: '13px', color: '#6b5fa0', textDecoration: 'none', borderBottom: '1px solid #6b5fa0', paddingBottom: '1px' }}>View all</Link>
          </div>

          {works.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {works.map(work => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontStyle: 'italic' }}>Works coming soon</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Check back closer to May 21, 2026</p>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY IT MATTERS + NEW ARTISTS ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '340px' }}>

        {/* Left — Why It Matters (dark) */}
        <div style={{ background: '#111', color: 'white', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '44px', height: '44px', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px' }}>✦</span>
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400, fontStyle: 'italic', margin: 0 }}>Why It Matters</h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { color: '#f87171', text: 'Verified artists & provenance' },
                { color: '#60a5fa', text: 'Direct support to artists' },
                { color: '#34d399', text: 'Affordable original art' },
                { color: '#fbbf24', text: 'Stories that connect you to the creative journey' },
              ].map(item => (
                <li key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '15px', color: 'rgba(255,255,255,0.85)' }}>
                  <span style={{ width: '24px', height: '3px', background: item.color, borderRadius: '2px', marginTop: '9px', flexShrink: 0 }} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1.5px solid white', color: 'white', padding: '12px 24px', borderRadius: '40px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', width: 'fit-content' }}>
            Learn More <span>→</span>
          </Link>
        </div>

        {/* Right — New Artists Every Month (purple) */}
        <div style={{ background: '#a78bfa', padding: '56px 48px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative brush stroke */}
          <div style={{ position: 'absolute', right: '-20px', top: '20px', fontSize: '80px', opacity: 0.15, transform: 'rotate(-20deg)', lineHeight: 1 }}>〰</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: '12px' }}>
            New Artists<br />Every Month
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '32px', lineHeight: 1.6 }}>
            We spotlight fresh talent from universities around the world.
          </p>

          {/* Artist avatars */}
          <div id="artists" style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
            {newArtists.length > 0 ? newArtists.map(artist => (
              <Link key={artist.id} href={`/artist/${artist.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.3)', border: '2px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {artist.photo_url ? (
                    <Image src={artist.photo_url} alt={artist.name} width={54} height={54} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  ) : (
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: 'white', fontWeight: 300 }}>{artist.name.charAt(0)}</span>
                  )}
                </div>
              </Link>
            )) : (
              [1,2,3,4].map(i => (
                <div key={i} style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.4)' }} />
              ))
            )}
          </div>

          <Link href="/gallery" style={{ fontSize: '14px', color: 'white', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.6)', paddingBottom: '2px', fontWeight: 500 }}>
            See all artists →
          </Link>
        </div>
      </section>

      {/* ── SUBSCRIBE ── */}
      <section style={{ background: 'white', padding: '72px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
            Be the first to discover
          </h2>
          <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
            New artists. New works. Straight to your inbox.
          </p>
          <form style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{ flex: '1', minWidth: '240px', maxWidth: '360px', padding: '14px 20px', border: '1.5px solid #e5e7eb', borderRadius: '40px', fontSize: '14px', outline: 'none' }}
            />
            <button
              type="submit"
              style={{ background: '#111', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '40px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  )
}

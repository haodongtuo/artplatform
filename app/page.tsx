import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import WorkCard from '@/components/WorkCard'
import ExhibitionScroll from '@/components/ExhibitionScroll'
import Image from 'next/image'

export const revalidate = 60

async function getFeaturedWorks() {
  const { data } = await supabase
    .from('art_works')
    .select('*, art_artists(*)')
    .eq('status', 'available')
    .limit(6)
    .order('created_at', { ascending: false })
  return data || []
}

async function getArtists() {
  const { data } = await supabase
    .from('art_artists')
    .select('*')
    .limit(8)
    .order('created_at', { ascending: true })
  return data || []
}

async function getExhibitions() {
  const { data } = await supabase
    .from('exhibitions')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function Home() {
  const [works, artists, exhibitions] = await Promise.all([getFeaturedWorks(), getArtists(), getExhibitions()])

  return (
    <div className="bg-[#f5f5f0]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f5f5f0]">

        {/* Mobile only — full-bleed background image + thick gradient overlay */}
        <div className="absolute inset-0 md:hidden z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero-paint.jpg" alt="" className="w-full h-full object-cover object-center" />
          {/* Thick white-to-transparent overlay so black text stays readable */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(245,245,240,0.92) 0%, rgba(245,245,240,0.88) 50%, rgba(245,245,240,0.70) 100%)' }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">

          {/* Left — Text */}
          <div className="relative z-10">
            {/* Tag pill */}
            <div className="inline-block bg-[#e8e4f0] text-[#6b5fa0] text-[11px] font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-8">
              A Home for Emerging Artists
            </div>

            {/* Headline */}
            <h1 className="font-black text-[clamp(40px,7vw,72px)] leading-[1.02] text-gray-900 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Discover<br />tomorrow&apos;s<br />artists
            </h1>
            <p className="font-bold italic text-[clamp(36px,6.5vw,66px)] leading-[1.08] text-amber-500 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              before the<br />gallery does.
            </p>
            {/* Underline */}
            <div className="w-3/4 h-[3px] bg-amber-500 rounded-full mb-8" />

            <p className="text-gray-500 text-base leading-relaxed max-w-sm mb-10">
              Collect original works from emerging university artists.
              Every purchase supports the artist who made it.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-700 text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-colors"
              >
                Explore Artworks <span>→</span>
              </Link>
              <Link
                href="/#artists"
                className="text-sm font-medium text-gray-900 border-b border-gray-900 hover:text-gray-500 hover:border-gray-500 transition-colors pb-0.5"
              >
                Meet the Artists
              </Link>
            </div>
          </div>

          {/* Right — Artistic collage (desktop only) */}
          <div className="hidden md:block relative h-[480px] md:h-[540px]">

            {/* Pink paint splash top-left */}
            <div className="absolute top-0 left-[5%] w-52 h-36 opacity-60 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 40% 40%, #f9a8d4 0%, #fda4af 60%, transparent 100%)', borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%', transform: 'rotate(-15deg)' }} />

            {/* Yellow paint splash center */}
            <div className="absolute top-[8%] right-[10%] w-44 h-28 opacity-55 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, #fde047 0%, #fbbf24 70%, transparent 100%)', borderRadius: '45% 55% 40% 60% / 55% 45% 55% 45%', transform: 'rotate(20deg)' }} />

            {/* Circular stamp — real emblem */}
            <div className="absolute top-[6%] left-[42%] w-28 h-28 z-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/emblem.svg" alt="Emerging Today · Collect Tomorrow" className="w-full h-full object-contain drop-shadow-sm" />
            </div>

            {/* Main paint splash photo */}
            <div className="absolute bottom-0 left-[12%] w-[62%] h-[82%] rounded-2xl overflow-hidden z-10 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero-paint.jpg" alt="Paint splash" className="w-full h-full object-cover object-top" />
            </div>

            {/* Black squiggly lines (decorative) */}
            <svg className="absolute top-[30%] right-[8%] w-20 h-20 z-10 opacity-25" viewBox="0 0 80 80" fill="none">
              <path d="M10 20 Q20 10 30 20 Q40 30 50 20 Q60 10 70 20" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M8 40 Q20 28 32 40 Q44 52 56 40 Q68 28 72 40" stroke="#111" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M15 60 Q27 50 38 58 Q50 66 62 56" stroke="#111" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>

            {/* Small dot */}
            <div className="absolute top-[55%] left-[6%] w-3 h-3 rounded-full bg-amber-400 z-10" />
            <div className="absolute top-[35%] right-[30%] w-2 h-2 rounded-full bg-[#6b5fa0] z-10" />
          </div>
        </div>
      </section>

      {/* Philosophy strip */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12 text-center">
        {[
          {
            icon: '🌱',
            title: 'Discover First',
            body: 'Discover tomorrow\'s artists before the gallery does. The most honest work happens before the world starts watching.'
          },
          {
            icon: '🤝',
            title: 'Support Directly',
            body: 'Support student artists directly — no galleries, no middlemen. Every dollar goes to the person who made it.'
          },
          {
            icon: '📜',
            title: 'Verified Provenance',
            body: 'Every artwork comes with verified provenance and artist story. Decades from now, you\'ll have proof you were there first.'
          },
        ].map((item) => (
          <div key={item.title} className="px-4">
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="serif text-lg font-medium mb-3 text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>

      {/* Current Exhibition Card — Event, not identity */}
      <section id="current-exhibition" className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-100 via-red-50 to-amber-100 border border-rose-200 p-8 md:p-12">
          {/* Confetti dots */}
          <div className="absolute top-4 right-8 text-2xl opacity-30 select-none">🎓</div>
          <div className="absolute bottom-6 right-16 text-xl opacity-20 select-none">✨</div>
          <div className="absolute top-10 right-32 text-lg opacity-20 select-none">🎨</div>

          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <span className="inline-block bg-rose-200 text-rose-700 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                Now Open · Class of 2026
              </span>
              <h2 className="serif text-3xl md:text-4xl font-light text-gray-900 mb-3">
                Cal State Fullerton — Graduation Exhibition 2026
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6 max-w-lg">
                Original works by this year's graduating students at California State University, Fullerton —
                paintings, drawings, mixed media, and more.
                Each piece carries the energy of a beginning.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-8">
                <span>📅 &nbsp;May 21, 2026</span>
                <span>🎨 &nbsp;Up to 50 artists</span>
                <span>🖼️ &nbsp;Original works only</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/gallery"
                  className="inline-block bg-gray-900 hover:bg-gray-700 text-white px-8 py-3 text-sm font-medium tracking-wide transition-colors rounded-sm"
                >
                  View All Works
                </Link>
                <Link
                  href="#artists"
                  className="inline-block border border-gray-300 text-gray-600 px-8 py-3 text-sm font-medium tracking-wide hover:border-gray-500 transition-colors rounded-sm"
                >
                  Meet the Artists
                </Link>
                <Link
                  href="/exhibition/la-graduation-2026"
                  className="inline-block border border-amber-400 text-amber-700 px-8 py-3 text-sm font-medium tracking-wide hover:bg-amber-50 transition-colors rounded-sm"
                >
                  Detail →
                </Link>
              </div>
            </div>
            {/* Stats */}
            <div className="md:w-56 grid grid-cols-2 md:grid-cols-1 gap-4">
              {[
                { num: works.length > 0 ? `${works.length}+` : '—', label: 'Works Available' },
                { num: artists.length > 0 ? `${artists.length}` : '—', label: 'Artists' },
                { num: '1', label: 'Exhibition' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="serif text-2xl font-light text-amber-600">{s.num}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions Scroll */}
      <ExhibitionScroll exhibitions={exhibitions} />

      {/* Featured Works */}
      {works.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="serif text-3xl font-light text-gray-900">From This Exhibition</h2>
            <Link href="/gallery" className="text-sm text-amber-600 hover:text-amber-700 border-b border-amber-300 hover:border-amber-500 transition-colors pb-0.5">
              See all works →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>
      )}

      {works.length === 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-16 text-center py-16">
          <div className="serif text-2xl text-gray-300 italic">Works coming soon</div>
          <p className="text-gray-400 mt-4 text-sm">Check back closer to the exhibition date — May 21, 2026</p>
        </section>
      )}

      {/* New Artists Every Month */}
      <section id="artists" className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="serif text-3xl font-light text-gray-900">New Artists Every Month</h2>
            <p className="text-gray-400 text-sm mt-1">Fresh talent joining the platform — be the first to collect.</p>
          </div>
          <Link href="/gallery" className="text-sm text-amber-600 hover:text-amber-700 border-b border-amber-300 hover:border-amber-500 transition-colors pb-0.5">
            See all artists →
          </Link>
        </div>

        {artists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {artists.map((artist) => (
              <Link key={artist.id} href={`/artist/${artist.id}`} className="group text-center">
                <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-amber-100 ring-2 ring-transparent group-hover:ring-amber-300 transition-all duration-300">
                  {artist.photo_url ? (
                    <Image src={artist.photo_url} alt={artist.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-amber-400 serif font-light">
                      {artist.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="serif font-medium text-sm text-gray-800 group-hover:text-amber-600 transition-colors">{artist.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{artist.year || artist.school}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="serif text-2xl text-gray-300 italic">Artists joining soon</div>
            <p className="text-gray-400 mt-4 text-sm">New artists will appear here as they join the platform</p>
          </div>
        )}
      </section>



      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="serif text-3xl font-light mb-3 text-gray-900">How to Purchase</h2>
        <p className="text-gray-400 text-sm mb-14">Simple, direct, and done in under a minute.</p>
        <div className="grid md:grid-cols-3 gap-10 text-left">
          {[
            { step: '01', title: 'Find the Work', desc: 'Browse online or scan the QR code next to any artwork at the physical exhibition.' },
            { step: '02', title: 'Buy Directly', desc: 'Complete your purchase securely in seconds. The artist gets paid directly — no middleman.' },
            { step: '03', title: 'Own a Beginning', desc: 'Your certificate of authenticity arrives by email. You were here at the start.' },
          ].map((item) => (
            <div key={item.step} className="relative pl-6 border-l-2 border-amber-200">
              <div className="text-xs text-amber-400 font-medium tracking-widest mb-2">{item.step}</div>
              <h3 className="serif font-medium text-lg mb-2 text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing quote */}
      <section className="bg-gradient-to-br from-amber-400 to-rose-400 text-white py-20 text-center px-6">
        <p className="serif text-3xl md:text-4xl font-light italic max-w-2xl mx-auto leading-relaxed mb-6">
          "The best time to collect art is before everyone else knows the name."
        </p>
        <p className="text-amber-100 text-sm tracking-widest uppercase">Before They Rise</p>
      </section>

    </div>
  )
}

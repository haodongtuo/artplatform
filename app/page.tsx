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

export default async function Home() {
  const [works, artists] = await Promise.all([getFeaturedWorks(), getArtists()])

  return (
    <div className="bg-[#FDFAF5]">

      {/* Hero — Platform Identity */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF8E7] via-[#FDF3DC] to-[#FCEFD4]">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-100 opacity-60"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-rose-100 opacity-40"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-yellow-100 opacity-50"></div>

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28 text-center">
          <p className="text-amber-600 text-xs tracking-[0.4em] uppercase mb-8 font-medium">
            A Home for Emerging Artists
          </p>
          <h1 className="serif text-5xl md:text-7xl font-light leading-tight mb-8 text-gray-900">
            Discover tomorrow's artists<br />
            <span className="italic text-amber-600">before the gallery does.</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-4">
            Collect original works from emerging university artists.
          </p>
          <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed mb-12">
            Every artwork comes with verified provenance and artist story —
            and your purchase goes directly to the artist who made it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gallery"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-10 py-3.5 text-sm font-medium tracking-wide transition-colors rounded-sm"
            >
              Browse the Collection
            </Link>
            <Link
              href="#current-exhibition"
              className="inline-block border border-amber-400 text-amber-700 px-10 py-3.5 text-sm font-medium tracking-wide hover:bg-amber-50 transition-colors rounded-sm"
            >
              Current Exhibition ↓
            </Link>
          </div>
        </div>

        {/* Wave divider */}
        <div className="h-12 bg-[#FDFAF5]" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }}></div>
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
                Graduation Exhibition
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6 max-w-lg">
                Original works by this year's graduating students — 
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

      {/* Artists */}
      {artists.length > 0 && (
        <section id="artists" className="bg-gradient-to-b from-[#FDFAF5] to-amber-50 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="serif text-3xl font-light mb-2 text-gray-900">The Class of 2026</h2>
            <p className="text-gray-400 text-sm mb-10">The artists you'll want to say you knew first.</p>
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
          </div>
        </section>
      )}

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

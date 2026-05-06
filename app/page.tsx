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
    <div>
      {/* Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-amber-100 to-black"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-32 md:py-48">
          <p className="text-amber-300 text-sm tracking-[0.3em] uppercase mb-6">
            University Graduation Exhibition
          </p>
          <h1 className="serif text-6xl md:text-8xl font-light leading-tight mb-8">
            Art<br />
            <span className="italic">2026</span>
          </h1>
          <p className="text-gray-300 text-xl mb-3 font-light">May 21, 2026</p>
          <p className="text-gray-400 mb-12 text-base">
            Original works by graduating students, available for direct purchase
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/gallery"
              className="inline-block bg-white text-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-gray-100 transition-colors"
            >
              View Gallery
            </Link>
            <Link
              href="#artists"
              className="inline-block border border-white text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-colors"
            >
              Meet the Artists
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}></div>
      </section>

      {/* Exhibition Info */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8 text-center">
        {[
          { label: 'Up to 50 Artists', icon: '🎨' },
          { label: 'Original Works', icon: '🖼️' },
          { label: 'Digital Certificate', icon: '📜' },
        ].map((item) => (
          <div key={item.label} className="p-8 border border-gray-100 rounded-sm">
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="serif text-lg font-medium">{item.label}</h3>
          </div>
        ))}
      </section>

      {/* Featured Works */}
      {works.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="serif text-3xl font-light">Featured Works</h2>
            <Link href="/gallery" className="text-sm text-gray-500 hover:text-black border-b border-gray-300 hover:border-black transition-colors pb-0.5">
              View all →
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
        <section className="max-w-6xl mx-auto px-4 pb-16 text-center py-20">
          <div className="serif text-2xl text-gray-300 italic">Works coming soon</div>
          <p className="text-gray-400 mt-4 text-sm">Check back closer to the exhibition date</p>
          <Link href="/admin" className="inline-block mt-6 text-xs text-gray-400 hover:text-black border-b border-gray-200 hover:border-black transition-colors">
            Admin: Add works →
          </Link>
        </section>
      )}

      {/* Artists Section */}
      {artists.length > 0 && (
        <section id="artists" className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="serif text-3xl font-light mb-8">The Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <Link key={artist.id} href={`/artist/${artist.id}`} className="group text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                    {artist.photo_url ? (
                      <Image src={artist.photo_url} alt={artist.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400 serif">
                        {artist.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="serif font-medium text-sm group-hover:text-gray-600 transition-colors">{artist.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{artist.year}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="serif text-3xl font-light mb-12">How to Purchase</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            { step: '01', title: 'Scan QR Code', desc: 'Find the QR code next to any artwork at the exhibition and scan it with your phone.' },
            { step: '02', title: 'Choose & Buy', desc: 'View the full work details and click the Buy button to complete your purchase securely.' },
            { step: '03', title: 'Receive Certificate', desc: 'Get a digital certificate of authenticity delivered to your email immediately.' },
          ].map((item) => (
            <div key={item.step}>
              <div className="text-5xl serif text-gray-100 font-bold mb-4">{item.step}</div>
              <h3 className="serif font-medium text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

import { supabase } from '@/lib/supabase'
import WorkCard from '@/components/WorkCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getExhibition(slug: string) {
  const { data } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

async function getExhibitionWorks(exhibitionId: string) {
  const { data } = await supabase
    .from('art_works')
    .select('*, art_artists(*)')
    .eq('exhibition_id', exhibitionId)
    .order('created_at', { ascending: false })
  return data || []
}

async function getExhibitionArtists(exhibitionId: string) {
  const { data } = await supabase
    .from('art_artists')
    .select('*')
    .eq('exhibition_id', exhibitionId)
    .order('created_at', { ascending: true })
  return data || []
}

const statusConfig = {
  active:   { label: 'Now Open',   cls: 'bg-emerald-100 text-emerald-700' },
  upcoming: { label: 'Coming Soon', cls: 'bg-amber-100 text-amber-700' },
  closed:   { label: 'Exhibition Closed', cls: 'bg-gray-100 text-gray-500' },
}

export default async function ExhibitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const exhibition = await getExhibition(slug)
  if (!exhibition) notFound()

  const [works, artists] = await Promise.all([
    getExhibitionWorks(exhibition.id),
    getExhibitionArtists(exhibition.id),
  ])

  const s = statusConfig[exhibition.status as keyof typeof statusConfig] || statusConfig.upcoming

  return (
    <div className="bg-[#FDFAF5]">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FFF8E7] via-[#FDF3DC] to-[#FCEFD4] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-xs text-amber-500 hover:text-amber-600 mb-6 inline-block">← All Exhibitions</Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.cls}`}>{s.label}</span>
            <span className="text-xs text-gray-400">📍 {exhibition.city}, {exhibition.country}</span>
            {exhibition.date && (
              <span className="text-xs text-gray-400">
                📅 {new Date(exhibition.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
          <h1 className="serif text-4xl md:text-5xl font-light text-gray-900 mb-3">{exhibition.name}</h1>
          <p className="text-gray-500 text-base font-light">{exhibition.school}</p>
          {exhibition.description && (
            <p className="text-gray-500 text-base leading-relaxed mt-4 max-w-2xl">{exhibition.description}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6 mt-8">
            {[
              { num: works.length, label: 'Works' },
              { num: artists.length, label: 'Artists' },
              { num: works.filter(w => w.status === 'available').length, label: 'Available' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl px-5 py-3 border border-amber-100 text-center">
                <div className="serif text-xl font-light text-amber-600">{s.num}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works */}
      {works.length > 0 ? (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="serif text-3xl font-light text-gray-900 mb-8">Works in This Exhibition</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {works.map(work => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-5xl mx-auto px-6 py-24 text-center">
          <p className="serif text-2xl text-gray-300 italic">Works coming soon</p>
          <p className="text-gray-400 mt-3 text-sm">Check back closer to the exhibition date</p>
        </section>
      )}

      {/* Artists */}
      {artists.length > 0 && (
        <section className="bg-gradient-to-b from-[#FDFAF5] to-amber-50 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="serif text-3xl font-light mb-2 text-gray-900">The Artists</h2>
            <p className="text-gray-400 text-sm mb-10">The names you'll want to remember.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {artists.map(artist => (
                <Link key={artist.id} href={`/artist/${artist.id}`} className="group text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-amber-100 ring-2 ring-transparent group-hover:ring-amber-300 transition-all duration-300">
                    {artist.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={artist.photo_url} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
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

      {/* CTA */}
      <section className="bg-gradient-to-br from-amber-400 to-rose-400 text-white py-16 text-center px-6">
        <p className="serif text-2xl md:text-3xl font-light italic mb-6 max-w-xl mx-auto">
          "The best time to collect art is before everyone else knows the name."
        </p>
        <p className="text-amber-100 text-xs tracking-widest uppercase mb-8">Before They Rise</p>
        <Link href="/gallery" className="inline-block bg-white text-amber-700 px-10 py-3.5 text-sm font-medium tracking-wide hover:bg-amber-50 transition-colors rounded-sm">
          Browse All Works
        </Link>
      </section>
    </div>
  )
}

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

      {/* Exhibition Details — How it works, how to join */}
      <section className="bg-gradient-to-r from-rose-50 via-amber-50 to-yellow-50 border-y border-amber-100 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="serif text-3xl font-light text-gray-900 mb-6">How It Works on the Day</h2>
          <div className="space-y-8 mb-14">
            {[
              { step: '01', who: 'For Artists', title: 'Set up your display', body: "Print the QR label from your artist dashboard and attach it to the bottom-right corner of your work. Display your piece near the ceremony — a simple easel is all you need. You don't need to handle any cash or take any payments yourself." },
              { step: '02', who: 'For Visitors', title: 'Scan the QR code', body: "Anyone with a smartphone can scan the code next to the artwork. No app required — just the camera. It opens directly to the work's page on beforetheyrise.com, with the full story, dimensions, artist bio, and price." },
              { step: '03', who: 'For Buyers', title: 'Purchase in seconds', body: 'Tap the Buy button. Complete payment securely online. A digital certificate of authenticity is emailed immediately. The artist receives the payment directly.' },
              { step: '04', who: 'After the Day', title: 'The artwork finds its home', body: "The artist arranges delivery or pickup with the buyer. The certificate lives permanently at beforetheyrise.com, verifiable by anyone. The collection — and the artist's story — begins here." },
            ].map(item => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0 w-10 text-right">
                  <span className="text-xs text-amber-400 font-medium tracking-widest">{item.step}</span>
                </div>
                <div className="border-l-2 border-amber-100 pl-6 pb-2">
                  <p className="text-[10px] text-amber-500 tracking-widest uppercase mb-1">{item.who}</p>
                  <h3 className="serif text-lg font-medium text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* School permit note */}
          <div className="bg-white rounded-xl border border-amber-200 p-6 mb-14">
            <h3 className="serif text-lg font-medium text-gray-800 mb-3">📋 A Note to Artists: Check with Your School First</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Before setting up your display at the graduation venue, reach out to your university's event office in advance. Some schools require a simple permit or prior approval.</p>
            <ul className="text-sm text-gray-500 space-y-2">
              {['Can graduating students display and sell personal artwork at or near the commencement venue?', 'Is a permit or advance approval required?', 'Are there designated areas for student displays?', 'What are the setup and teardown time windows?'].map(q => (
                <li key={q} className="flex gap-2"><span className="text-amber-400 mt-0.5">→</span><span>{q}</span></li>
              ))}
            </ul>
          </div>

          {/* How to join */}
          <h2 className="serif text-3xl font-light text-gray-900 mb-4">How to Join the Exhibition</h2>
          <p className="text-gray-500 text-base leading-relaxed mb-10">Getting your work onto the platform takes about five minutes.</p>
          <div className="space-y-10 mb-12">
            {[
              { n: 1, title: 'Create your account', body: 'Go to beforetheyrise.com/register and sign up with your email. This is your permanent artist account.' },
              { n: 2, title: 'Build your artist profile', body: 'Fill in your name, school, graduation year, a short bio, and optionally a photo and Instagram handle.' },
              { n: 3, title: 'Upload your work', body: 'From your dashboard, click "Add Work". Fill in title, medium, dimensions, description, image, and price (pre-set to $521 — May 21st).' },
              { n: 4, title: 'Print your QR label', body: 'Click "Print QR Label" next to your work. A printable card appears with the QR code, title, name, and price. Attach it to the bottom-right corner.' },
              { n: 5, title: 'Show up on graduation day', body: "Bring your work to campus on May 21st. Set it up near the ceremony — an easel is all you need. Buyers scan the QR code and pay online. The payment comes directly to you." },
            ].map(item => (
              <div key={item.n} className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-sm">{item.n}</div>
                <div className="pt-1">
                  <h3 className="serif text-lg font-medium text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-amber-100 p-6 mb-14">
            <p className="text-sm font-medium text-gray-700 mb-2">💡 Tips for a great listing</p>
            <ul className="text-sm text-gray-500 space-y-1.5">
              {['Photograph your work in natural daylight — it makes a huge difference.', 'Write your description in first person. Buyers want to hear you, not a press release.', 'Upload before May 15th so your work has time to appear in the gallery before the event.'].map(t => (
                <li key={t} className="flex gap-2"><span className="text-amber-400">→</span><span>{t}</span></li>
              ))}
            </ul>
          </div>

          {/* $521 */}
          <div className="text-center py-10 border-t border-amber-100">
            <p className="text-5xl serif font-light text-amber-600 mb-3">$521</p>
            <h2 className="serif text-2xl font-light text-gray-800 mb-3">The Price Means Something</h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-lg mx-auto">
              Every work in this exhibition is priced at <strong className="text-gray-700">$521</strong> — the date: <strong className="text-gray-700">May 21st</strong>. Graduation day. The price is part of the story.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-amber-400 to-rose-400 text-white py-16 text-center px-6">
        <p className="serif text-2xl md:text-3xl font-light italic mb-6 max-w-xl mx-auto">
          "The best time to collect art is before everyone else knows the name."
        </p>
        <p className="text-amber-100 text-xs tracking-widest uppercase mb-8">Before They Rise</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/gallery" className="inline-block bg-white text-amber-700 px-10 py-3.5 text-sm font-medium tracking-wide hover:bg-amber-50 transition-colors rounded-sm">
            Browse All Works
          </Link>
          <Link href="/register" className="inline-block border border-white text-white px-10 py-3.5 text-sm font-medium tracking-wide hover:bg-white hover:text-amber-700 transition-colors rounded-sm">
            I'm an Artist — Join the Exhibition
          </Link>
        </div>
      </section>
    </div>
  )
}

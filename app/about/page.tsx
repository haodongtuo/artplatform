import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="bg-[#FDFAF5]">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FFF8E7] via-[#FDF3DC] to-[#FCEFD4] py-24 px-6 text-center">
        <p className="text-amber-600 text-xs tracking-[0.4em] uppercase mb-6 font-medium">About This Platform</p>
        <h1 className="serif text-5xl md:text-6xl font-light text-gray-900 leading-tight mb-6">
          Before They Rise
        </h1>
        <p className="text-gray-500 text-xl font-light max-w-2xl mx-auto leading-relaxed">
          A platform built for art students — especially those on the edge of graduation,
          standing at the moment when everything is about to change.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="serif text-3xl font-light text-gray-900 mb-6">What is Before They Rise?</h2>
        <div className="space-y-5 text-gray-600 leading-relaxed text-base">
          <p>
            <strong className="text-gray-900">Before They Rise</strong> is an online platform dedicated to art students —
            especially those approaching graduation, standing at the moment when everything is about to change.
          </p>
          <p>
            We believe that some of the most exciting art in the world is being made right now, in university
            studios, by students whose names you don't yet know.
          </p>
          <p>
            Our mission is simple: give them a real audience, before the world catches up.
          </p>
          <p>
            Every work listed on Before They Rise comes with an <strong className="text-gray-900">NFT certificate</strong> —
            a permanent, verifiable record tied to the piece and its creator. Not a gimmick. A proof of origin.
            When you buy here, you're not just buying a painting. You're documenting a beginning.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 border-y border-gray-100 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="serif text-3xl font-light text-gray-900 mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: '🎨',
                title: 'Curated Online Exhibitions',
                body: 'We organize themed shows — "LA Emerging Artists Top 30", "Graduation Show Picks", "Under $500 Collection", "Photography Students to Watch" — so buyers don\'t need to search. They discover.'
              },
              {
                icon: '📍',
                title: 'Offline Pop-up Shows',
                body: 'Monthly events in cafés, galleries, hotel lobbies, and co-working spaces. The platform handles the purchase and the certificate. The pop-up handles the trust and the experience.'
              },
              {
                icon: '🏫',
                title: 'Student Organizations',
                body: 'We work with student groups at art schools city by city — each one a local team, a local voice, a local show. Starting in Los Angeles, growing from there.'
              },
            ].map(item => (
              <div key={item.title} className="text-center px-2">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="serif text-lg font-medium text-gray-800 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Buys Here */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="serif text-3xl font-light text-gray-900 mb-10">Who Buys Here</h2>
        <div className="space-y-6">
          {[
            {
              label: 'Young Professionals',
              desc: 'Lawyers, designers, tech employees, real estate agents, doctors — people who want something real on their walls, with a story behind it.',
              emoji: '💼'
            },
            {
              label: 'Spaces',
              desc: 'Cafés, restaurants, boutique hotels, co-working spaces, clinics — places looking for art that carries meaning and provenance, not just decoration.',
              emoji: '🏢'
            },
            {
              label: 'Families',
              desc: 'People who want to support art, culture, and education — without having to navigate the gallery world. Here, the context comes with the work.',
              emoji: '🏡'
            },
          ].map(item => (
            <div key={item.label} className="flex gap-5 p-6 bg-white rounded-xl border border-amber-100">
              <span className="text-2xl flex-shrink-0">{item.emoji}</span>
              <div>
                <h3 className="serif font-medium text-gray-800 mb-1">{item.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section className="bg-gradient-to-r from-amber-50 to-rose-50 border-y border-amber-100 py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="serif text-3xl font-light text-gray-900 mb-6">Where We're Headed</h2>
          <p className="text-gray-600 leading-relaxed text-base mb-4">
            We're starting in Los Angeles. Over time, we'll build student organizations at art schools
            city by city — each one a local team, a local voice, a local show.
          </p>
          <p className="text-gray-600 leading-relaxed text-base">
            The art world has always had gatekeepers. We're building a door.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-amber-400 to-rose-400 text-white py-20 text-center px-6">
        <h2 className="serif text-3xl md:text-4xl font-light italic mb-4">
          "The best time to collect art is before everyone else knows the name."
        </h2>
        <p className="text-amber-100 text-sm tracking-widest uppercase mb-10">Before They Rise</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/gallery"
            className="inline-block bg-white text-amber-700 px-10 py-3.5 text-sm font-medium tracking-wide hover:bg-amber-50 transition-colors rounded-sm"
          >
            Browse the Collection
          </Link>
          <Link
            href="/register"
            className="inline-block border border-white text-white px-10 py-3.5 text-sm font-medium tracking-wide hover:bg-white hover:text-amber-700 transition-colors rounded-sm"
          >
            I'm an Artist — Join the Exhibition
          </Link>
        </div>
      </section>

    </div>
  )
}

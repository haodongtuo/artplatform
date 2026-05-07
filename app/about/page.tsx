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
          A platform for collecting original art from emerging university students —
          at the exact moment their career begins.
        </p>
      </section>

      {/* What is this */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="serif text-3xl font-light text-gray-900 mb-6">What is Before They Rise?</h2>
        <div className="space-y-5 text-gray-600 leading-relaxed text-base">
          <p>
            <strong className="text-gray-900">Before They Rise</strong> is an online platform dedicated to the earliest chapter of an artist's career.
            We showcase and sell original works created by graduating university art students — before the galleries
            discover them, before the prices climb, and before the world catches on.
          </p>
          <p>
            Every piece on this platform is an original work. Every artist is at the very beginning.
            Every purchase comes with a verified digital certificate of authenticity, documenting the artist's name,
            school, the work's dimensions, medium, and the date it entered its first collection.
          </p>
          <p>
            This is not a gallery. There are no commissions taken from artists. No middlemen.
            When you buy a work, 100% of the payment goes directly to the student who created it.
          </p>
        </div>
      </section>

      {/* The Event — Graduation Day */}
      <section className="bg-gradient-to-r from-rose-50 via-amber-50 to-yellow-50 border-y border-amber-100 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-rose-200 text-rose-700 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-6">
            Class of 2026 · Graduation Day
          </span>
          <h2 className="serif text-3xl font-light text-gray-900 mb-6">
            The Exhibition: May 21, 2026
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed text-base">
            <p>
              On graduation day, participating artists will display their works <strong className="text-gray-900">in person on campus</strong> —
              ideally set up around the perimeter of the commencement venue, in the outdoor areas where
              families naturally gather before and after the ceremony.
            </p>
            <p>
              Imagine this: you've just watched your daughter walk across the stage. You're standing
              outside with flowers, waiting. And right there, a few feet away, is a painting she made —
              and next to it, a small card with a QR code.
            </p>
            <p>
              You scan it. You see the full story. You buy it. It ships to your home.
              And twenty years from now, it's hanging in your living room.
            </p>
            <p>
              Parents, grandparents, siblings, and friends attending commencement are the natural audience.
              They're already emotional. They already want to celebrate. They already want to bring something home.
            </p>
          </div>

          {/* Callout box */}
          <div className="mt-10 bg-white rounded-xl border border-amber-200 p-6">
            <h3 className="serif text-lg font-medium text-gray-800 mb-3">📋 A Note to Artists: Check with Your School First</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Before setting up your display at the graduation venue, we strongly recommend reaching out
              to your university's event office or student affairs department in advance.
              Some schools require a simple permit or prior approval for any commercial activity on campus —
              even informal student art sales.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Here's what to ask:
            </p>
            <ul className="text-sm text-gray-500 space-y-2 list-none pl-0">
              {[
                'Can graduating students display and sell personal artwork at or near the commencement venue?',
                'Is a permit or advance approval required for this?',
                'Are there designated areas for student displays?',
                'What are the setup and teardown time windows?',
              ].map((q) => (
                <li key={q} className="flex gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-xs mt-4 italic">
              Most schools are supportive of student initiatives like this — it just takes one email or phone call to confirm.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="serif text-3xl font-light text-gray-900 mb-10">How It Works on the Day</h2>
        <div className="space-y-8">
          {[
            {
              step: '01',
              who: 'For Artists',
              title: 'Set up your display',
              body: 'Print the QR label from your artist dashboard and attach it to the bottom-right corner of your work. Display your piece near the ceremony — a simple easel is all you need. You don\'t need to handle any cash or take any payments yourself.'
            },
            {
              step: '02',
              who: 'For Visitors',
              title: 'Scan the QR code',
              body: 'Anyone with a smartphone can scan the code next to the artwork. No app required — just the camera. It opens directly to the work\'s page on beforetheyrise.com, with the full story, dimensions, artist bio, and price.'
            },
            {
              step: '03',
              who: 'For Buyers',
              title: 'Purchase in seconds',
              body: 'Tap the Buy button. Complete payment securely online. A digital certificate of authenticity is emailed immediately. The artist receives the payment directly.'
            },
            {
              step: '04',
              who: 'After the Day',
              title: 'The artwork finds its home',
              body: 'The artist arranges delivery or pickup with the buyer. The certificate lives permanently at beforetheyrise.com, verifiable by anyone. The collection — and the artist\'s story — begins here.'
            },
          ].map((item) => (
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
      </section>

      {/* How to Register & Upload */}
      <section className="bg-gray-50 border-y border-gray-100 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-6">
            For Artists
          </span>
          <h2 className="serif text-3xl font-light text-gray-900 mb-4">How to Join the Exhibition</h2>
          <p className="text-gray-500 text-base leading-relaxed mb-12">
            Getting your work onto the platform takes about five minutes. Here's exactly what to do.
          </p>

          <div className="space-y-10">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-sm">1</div>
              <div>
                <h3 className="serif text-lg font-medium text-gray-800 mb-2">Create your account</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  Go to <strong className="text-gray-700">beforetheyrise.com/register</strong> and sign up with your email address.
                  This is your permanent artist account — you'll use it to manage your works, view orders, and access your QR labels.
                </p>
                <Link href="/register" className="inline-block text-xs bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-sm transition-colors">
                  Register Now →
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-sm">2</div>
              <div>
                <h3 className="serif text-lg font-medium text-gray-800 mb-2">Build your artist profile</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  After registering, fill in your name, school, graduation year, a short bio, and optionally a photo and Instagram handle.
                  This is what buyers see when they tap your name — make it feel like you.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-sm">3</div>
              <div>
                <h3 className="serif text-lg font-medium text-gray-800 mb-2">Upload your work</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  From your dashboard, click <strong className="text-gray-700">"Add Work"</strong> and fill in the details:
                </p>
                <ul className="text-sm text-gray-500 space-y-1.5 pl-0">
                  {[
                    { field: 'Title', note: 'The name of the piece' },
                    { field: 'Medium', note: 'e.g. Oil on canvas, Watercolor, Charcoal' },
                    { field: 'Dimensions', note: 'Width × Height in cm' },
                    { field: 'Year', note: '2026' },
                    { field: 'Description', note: 'A few sentences about the work — what inspired it, what it means to you' },
                    { field: 'Image', note: 'A clear photo of the work (good natural lighting, no shadows)' },
                    { field: 'Price', note: 'Pre-set to $521 — the date, May 21st, graduation day' },
                  ].map(item => (
                    <li key={item.field} className="flex gap-2">
                      <span className="text-amber-400">→</span>
                      <span><strong className="text-gray-700">{item.field}:</strong> {item.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-sm">4</div>
              <div>
                <h3 className="serif text-lg font-medium text-gray-800 mb-2">Print your QR label</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Once your work is saved, go to your dashboard and click <strong className="text-gray-700">"Print QR Label"</strong> next to the work.
                  A printable card will appear — it includes the QR code, your work's title, your name, and the price.
                  Print it, cut it out, and attach it to the <strong className="text-gray-700">bottom-right corner</strong> of your artwork.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-sm">5</div>
              <div>
                <h3 className="serif text-lg font-medium text-gray-800 mb-2">Show up on graduation day</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Bring your work to campus on May 21st. Set it up near the ceremony — an easel is all you need.
                  You don't need to handle payments. Anyone who wants to buy simply scans the QR code on their phone and completes the purchase online.
                  You'll receive a notification, and the payment comes directly to you.
                </p>
              </div>
            </div>
          </div>

          {/* Tip box */}
          <div className="mt-12 bg-white rounded-xl border border-amber-100 p-6">
            <p className="text-sm font-medium text-gray-700 mb-2">💡 Tips for a great listing</p>
            <ul className="text-sm text-gray-500 space-y-1.5">
              <li className="flex gap-2"><span className="text-amber-400">→</span><span>Photograph your work in natural daylight — it makes a huge difference.</span></li>
              <li className="flex gap-2"><span className="text-amber-400">→</span><span>Write your description in first person. Buyers want to hear <em>you</em>, not a press release.</span></li>
              <li className="flex gap-2"><span className="text-amber-400">→</span><span>Upload before May 15th so your work has time to appear in the gallery before the event.</span></li>
              <li className="flex gap-2"><span className="text-amber-400">→</span><span>Check with your school about setting up near the commencement venue — most are supportive, but confirm in advance.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why $521 */}
      <section className="bg-amber-50 border-y border-amber-100 py-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-5xl serif font-light text-amber-600 mb-4">$521</p>
          <h2 className="serif text-2xl font-light text-gray-800 mb-4">The Price Means Something</h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Every work in this exhibition is priced at <strong className="text-gray-700">$521</strong> —
            not a round number, not an estimate of market value.
            It's the date: <strong className="text-gray-700">May 21st</strong>.
            Graduation day. The day the work was shown for the first time.
            The price is part of the story.
          </p>
        </div>
      </section>

      {/* Why collect early */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="serif text-3xl font-light text-gray-900 mb-6">Why Collect at the Beginning?</h2>
        <div className="space-y-5 text-gray-600 leading-relaxed text-base">
          <p>
            The most significant art collections in the world weren't built by buying famous names.
            They were built by people who paid attention early — who trusted their eye before anyone
            else was looking.
          </p>
          <p>
            A student graduation show is one of the last places left where you can walk up to an original
            work, meet the person who made it, and bring it home for a few hundred dollars.
            That window closes quickly.
          </p>
          <p>
            We're not promising every artist here will be famous. But we are saying:
            <em className="text-gray-800"> these works are real, these artists are serious, and this moment won't repeat itself.</em>
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

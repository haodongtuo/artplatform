'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EventDetailsAccordion() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-amber-200 rounded-2xl overflow-hidden bg-white">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-amber-50 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <span className="inline-block bg-rose-200 text-rose-700 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full">
            Class of 2026 · May 21
          </span>
          <span className="serif text-xl font-light text-gray-900">Graduation Exhibition — Full Details</span>
        </div>
        <span className={`text-amber-500 text-xl transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          ↓
        </span>
      </button>

      {/* Expandable content */}
      {open && (
        <div className="border-t border-amber-100">

          {/* The Event */}
          <section className="bg-gradient-to-r from-rose-50 via-amber-50 to-yellow-50 px-8 py-12">
            <h2 className="serif text-2xl font-light text-gray-900 mb-6">
              The Exhibition: May 21, 2026
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-base max-w-3xl">
              <p>
                On graduation day, participating artists will display their works{' '}
                <strong className="text-gray-900">in person on campus</strong> —
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

            {/* School check callout */}
            <div className="mt-8 bg-white rounded-xl border border-amber-200 p-6 max-w-3xl">
              <h3 className="serif text-lg font-medium text-gray-800 mb-3">📋 A Note to Artists: Check with Your School First</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Before setting up your display at the graduation venue, we strongly recommend reaching out
                to your university's event office or student affairs department in advance.
                Some schools require a simple permit or prior approval for any commercial activity on campus —
                even informal student art sales.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">Here's what to ask:</p>
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
          </section>

          {/* How It Works on the Day */}
          <section className="px-8 py-12 max-w-3xl">
            <h2 className="serif text-2xl font-light text-gray-900 mb-8">How It Works on the Day</h2>
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  who: 'For Artists',
                  title: 'Set up your display',
                  body: "Print the QR label from your artist dashboard and attach it to the bottom-right corner of your work. Display your piece near the ceremony — a simple easel is all you need. You don't need to handle any cash or take any payments yourself."
                },
                {
                  step: '02',
                  who: 'For Visitors',
                  title: 'Scan the QR code',
                  body: "Anyone with a smartphone can scan the code next to the artwork. No app required — just the camera. It opens directly to the work's page on beforetheyrise.com, with the full story, dimensions, artist bio, and price."
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
                  body: "The artist arranges delivery or pickup with the buyer. The certificate lives permanently at beforetheyrise.com, verifiable by anyone. The collection — and the artist's story — begins here."
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
          <section className="bg-gray-50 border-t border-gray-100 px-8 py-12">
            <div className="max-w-3xl">
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-6">
                For Artists
              </span>
              <h2 className="serif text-2xl font-light text-gray-900 mb-4">How to Join the Exhibition</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-10">
                Getting your work onto the platform takes about five minutes. Here's exactly what to do.
              </p>

              <div className="space-y-10">
                {[
                  {
                    n: 1,
                    title: 'Create your account',
                    body: (
                      <>
                        <p className="text-sm text-gray-500 leading-relaxed mb-3">
                          Go to <strong className="text-gray-700">beforetheyrise.com/register</strong> and sign up with your email address.
                          This is your permanent artist account — you'll use it to manage your works, view orders, and access your QR labels.
                        </p>
                        <Link href="/register" className="inline-block text-xs bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-sm transition-colors">
                          Register Now →
                        </Link>
                      </>
                    )
                  },
                  {
                    n: 2,
                    title: 'Build your artist profile',
                    body: (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        After registering, fill in your name, school, graduation year, a short bio, and optionally a photo and Instagram handle.
                        This is what buyers see when they tap your name — make it feel like you.
                      </p>
                    )
                  },
                  {
                    n: 3,
                    title: 'Upload your work',
                    body: (
                      <>
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
                      </>
                    )
                  },
                  {
                    n: 4,
                    title: 'Print your QR label',
                    body: (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Once your work is saved, go to your dashboard and click <strong className="text-gray-700">"Print QR Label"</strong> next to the work.
                        A printable card will appear — it includes the QR code, your work's title, your name, and the price.
                        Print it, cut it out, and attach it to the <strong className="text-gray-700">bottom-right corner</strong> of your artwork.
                      </p>
                    )
                  },
                  {
                    n: 5,
                    title: 'Show up on graduation day',
                    body: (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Bring your work to campus on May 21st. Set it up near the ceremony — an easel is all you need.
                        You don't need to handle payments. Anyone who wants to buy simply scans the QR code on their phone and completes the purchase online.
                        You'll receive a notification, and the payment comes directly to you.
                      </p>
                    )
                  },
                ].map(item => (
                  <div key={item.n} className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-sm">
                      {item.n}
                    </div>
                    <div className="pt-1">{item.body}</div>
                  </div>
                ))}
              </div>

              {/* Tips */}
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

          {/* $521 */}
          <section className="bg-amber-50 border-t border-amber-100 py-14 px-8 text-center">
            <p className="text-5xl serif font-light text-amber-600 mb-4">$521</p>
            <h2 className="serif text-2xl font-light text-gray-800 mb-4">The Price Means Something</h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto">
              Every work in this exhibition is priced at <strong className="text-gray-700">$521</strong> —
              not a round number, not an estimate of market value.
              It's the date: <strong className="text-gray-700">May 21st</strong>.
              Graduation day. The day the work was shown for the first time.
              The price is part of the story.
            </p>
          </section>

          {/* Why collect early */}
          <section className="px-8 py-12 max-w-3xl">
            <h2 className="serif text-2xl font-light text-gray-900 mb-6">Why Collect at the Beginning?</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-base">
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
                We're not promising every artist here will be famous. But we are saying:{' '}
                <em className="text-gray-800">these works are real, these artists are serious, and this moment won't repeat itself.</em>
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="border-t border-amber-100 px-8 py-10 bg-gradient-to-r from-amber-50 to-rose-50 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gallery"
              className="inline-block bg-gray-900 hover:bg-gray-700 text-white px-8 py-3 text-sm font-medium tracking-wide transition-colors rounded-sm text-center"
            >
              Browse the Collection
            </Link>
            <Link
              href="/register"
              className="inline-block border border-amber-400 text-amber-700 px-8 py-3 text-sm font-medium tracking-wide hover:bg-amber-50 transition-colors rounded-sm text-center"
            >
              I'm an Artist — Join the Exhibition
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState } from 'react'
import { Work } from '@/lib/supabase'

interface Props {
  work: Work & { art_artists?: { venmo?: string; zelle?: string; name?: string } }
}

export default function BuyButton({ work }: Props) {
  const [step, setStep] = useState<'idle' | 'paying' | 'confirm' | 'done' | 'loading'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')

  const artist = work.art_artists
  const venmo = artist?.venmo
  const zelle = artist?.zelle
  const hasPayment = venmo || zelle

  // Build Venmo deep link
  const venmoLink = venmo
    ? `https://venmo.com/${venmo.replace('@', '')}?txn=pay&amount=${work.price}&note=${encodeURIComponent(`${work.title} — beforetheyrise.com`)}`
    : null

  if (work.status !== 'available') {
    return (
      <button disabled className="w-full py-4 bg-gray-100 text-gray-400 text-sm cursor-not-allowed rounded-sm">
        {work.status === 'sold' ? '✓ Sold · 已售出' : 'Reserved · 已预留'}
      </button>
    )
  }

  if (step === 'done') {
    return (
      <div className="w-full py-5 bg-green-50 border border-green-200 rounded-sm text-center">
        <p className="text-green-700 font-medium text-sm">🎉 Payment confirmed!</p>
        <p className="text-green-600 text-xs mt-1">Your certificate of authenticity is on its way to {email}</p>
      </div>
    )
  }

  // Step 1 — idle
  if (step === 'idle') {
    if (!hasPayment) {
      return (
        <div className="w-full py-4 bg-amber-50 border border-amber-200 rounded-sm text-center px-4">
          <p className="text-amber-700 text-sm">Contact the artist directly to purchase this work.</p>
        </div>
      )
    }
    return (
      <button
        onClick={() => setStep('paying')}
        className="w-full py-4 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors rounded-sm"
      >
        Buy Now — ${work.price.toLocaleString()}
      </button>
    )
  }

  // Step 2 — show Venmo / Zelle options
  if (step === 'paying') {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-100 rounded-sm p-4 text-center">
          <p className="text-sm font-medium text-gray-800 mb-1">Pay ${work.price} directly to the artist</p>
          <p className="text-xs text-gray-500">No middleman. Money goes straight to {artist?.name}.</p>
        </div>

        {/* Venmo */}
        {venmoLink && (
          <a
            href={venmoLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setTimeout(() => setStep('confirm'), 1500)}
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#3d95ce] hover:bg-[#2d80b5] text-white text-sm font-medium rounded-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M19.5 2C20.9 3.7 21.5 5.4 21.5 7.6c0 6.3-5.4 14.5-9.8 20.4H2.6L0 2.5l8.4-.8 1.4 11c1.2-2 2.7-5.2 2.7-7.4 0-1.2-.2-2-.5-2.7z"/></svg>
            Pay with Venmo ({venmo})
          </a>
        )}

        {/* Zelle */}
        {zelle && (
          <div
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#6d1ed4] hover:bg-[#5a18af] text-white text-sm font-medium rounded-sm transition-colors cursor-pointer"
            onClick={() => {
              navigator.clipboard?.writeText(zelle).catch(() => {})
              setNote(`Zelle: ${zelle} copied!`)
              setTimeout(() => setStep('confirm'), 800)
            }}
          >
            <svg viewBox="0 0 40 20" className="w-10 h-5 fill-white"><text y="16" fontSize="16" fontWeight="bold">Zelle</text></svg>
            Pay via Zelle — send to {zelle}
          </div>
        )}

        {note && <p className="text-xs text-center text-green-600">{note}</p>}

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          After paying, come back here and confirm your payment to receive your certificate of authenticity.
        </p>

        <button
          onClick={() => setStep('confirm')}
          className="w-full py-3 border border-gray-200 text-gray-600 text-sm hover:border-gray-400 transition-colors rounded-sm"
        >
          I've already paid →
        </button>

        <button onClick={() => setStep('idle')} className="w-full text-xs text-gray-400 hover:text-black py-1 transition-colors">
          Cancel
        </button>
      </div>
    )
  }

  // Step 3 — confirm payment, collect email
  async function handleConfirm() {
    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email')
      return
    }
    setError('')
    setStep('loading')
    try {
      const res = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workId: work.id, buyerName: name, buyerEmail: email }),
      })
      const data = await res.json()
      if (data.ok) {
        setStep('done')
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
        setStep('confirm')
      }
    } catch {
      setError('Network error. Please try again.')
      setStep('confirm')
    }
  }

  if (step === 'confirm' || step === 'loading') {
    return (
      <div className="space-y-3">
        <div className="bg-green-50 border border-green-100 rounded-sm p-4 text-center">
          <p className="text-sm font-medium text-green-800">✓ Payment sent? Great!</p>
          <p className="text-xs text-green-600 mt-1">Enter your details below to receive your certificate of authenticity.</p>
        </div>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          onClick={handleConfirm}
          disabled={step === 'loading'}
          className="w-full py-4 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-300 rounded-sm"
        >
          {step === 'loading' ? 'Sending certificate…' : 'Confirm Payment & Get Certificate →'}
        </button>
        <button onClick={() => setStep('paying')} className="w-full text-xs text-gray-400 hover:text-black py-1 transition-colors">
          ← Go back
        </button>
      </div>
    )
  }

  return null
}

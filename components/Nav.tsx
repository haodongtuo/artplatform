'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [artistName, setArtistName] = useState('')

  useEffect(() => {
    setArtistName(localStorage.getItem('art_artist_name') || '')
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="serif text-xl font-semibold tracking-wide">
          Art <span className="text-gray-400 text-sm font-light">2026</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/gallery" className="text-gray-600 hover:text-black transition-colors">
            Gallery
          </Link>
          <Link href="/#artists" className="text-gray-600 hover:text-black transition-colors">
            Artists
          </Link>
          {artistName ? (
            <Link href="/dashboard" className="text-black font-medium hover:text-gray-600 transition-colors">
              {artistName}
            </Link>
          ) : (
            <Link href="/login" className="bg-black text-white px-4 py-1.5 rounded text-xs hover:bg-gray-800 transition-colors">
              Artist Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/gallery" onClick={() => setOpen(false)}>Gallery</Link>
          <Link href="/#artists" onClick={() => setOpen(false)}>Artists</Link>
          {artistName ? (
            <Link href="/dashboard" onClick={() => setOpen(false)}>My Dashboard</Link>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}>Artist Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}

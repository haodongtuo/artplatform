'use client'
import { useState, useMemo } from 'react'
import WorkCard from '@/components/WorkCard'
import { Work } from '@/lib/supabase'

interface Props {
  works: Work[]
  mediums: string[]
  cities: string[]
  suggestedCity?: string | null
}

export default function GalleryFilters({ works, mediums, cities, suggestedCity }: Props) {
  const [medium, setMedium] = useState('')
  const [status, setStatus] = useState('')
  const [city, setCity] = useState('')
  const [maxPrice, setMaxPrice] = useState(10000)
  const [localDismissed, setLocalDismissed] = useState(false)

  const maxActualPrice = useMemo(() => {
    if (works.length === 0) return 10000
    return Math.max(...works.map(w => w.price || 0))
  }, [works])

  const filtered = useMemo(() => {
    return works.filter(w => {
      if (medium && w.medium !== medium) return false
      if (status && w.status !== status) return false
      if (w.price > maxPrice) return false
      if (city) {
        const workCity = (w as any).exhibitions?.city || ''
        if (workCity.toLowerCase() !== city.toLowerCase()) return false
      }
      return true
    })
  }, [works, medium, status, maxPrice, city])

  // Show local suggestion banner if IP detected a matching city and user hasn't filtered yet
  const showLocalBanner = !localDismissed && suggestedCity && !city

  return (
    <>
      {/* Local suggestion banner */}
      {showLocalBanner && (
        <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
          <span className="text-lg">📍</span>
          <p className="text-sm text-amber-800 flex-1">
            We found works near you in <strong>{suggestedCity}</strong>.
          </p>
          <button
            onClick={() => setCity(suggestedCity!)}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-full transition-colors"
          >
            Show local works →
          </button>
          <button
            onClick={() => setLocalDismissed(true)}
            className="text-xs text-amber-400 hover:text-amber-600 px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-gray-100">

        {/* City */}
        {cities.length > 1 && (
          <div>
            <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">City</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="text-sm border border-gray-200 rounded px-3 py-1.5 bg-white min-w-[150px]"
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Medium</label>
          <select
            value={medium}
            onChange={e => setMedium(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-1.5 bg-white min-w-[140px]"
          >
            <option value="">All</option>
            {mediums.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-1.5 bg-white"
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">
            Max Price: {maxPrice >= maxActualPrice ? 'Any' : `$${maxPrice.toLocaleString()}`}
          </label>
          <input
            type="range"
            min={0}
            max={maxActualPrice || 10000}
            step={50}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-36 accent-black"
          />
        </div>

        <div className="self-end text-sm text-gray-400 pb-0.5">
          {filtered.length} {filtered.length !== 1 ? 'works' : 'work'}
          {city && <span className="ml-2 text-amber-500 text-xs">in {city}</span>}
        </div>

        {/* Clear filters */}
        {(city || medium || status || maxPrice < maxActualPrice) && (
          <div className="self-end pb-0.5">
            <button
              onClick={() => { setCity(''); setMedium(''); setStatus(''); setMaxPrice(10000) }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="serif italic text-2xl mb-2">No works found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(work => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </>
  )
}

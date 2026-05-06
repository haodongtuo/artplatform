'use client'
import { useState, useMemo } from 'react'
import WorkCard from '@/components/WorkCard'
import { Work } from '@/lib/supabase'

interface Props {
  works: Work[]
  mediums: string[]
}

export default function GalleryFilters({ works, mediums }: Props) {
  const [medium, setMedium] = useState('')
  const [status, setStatus] = useState('')
  const [maxPrice, setMaxPrice] = useState(10000)

  const maxActualPrice = useMemo(() => {
    if (works.length === 0) return 10000
    return Math.max(...works.map(w => w.price || 0))
  }, [works])

  const filtered = useMemo(() => {
    return works.filter(w => {
      if (medium && w.medium !== medium) return false
      if (status && w.status !== status) return false
      if (w.price > maxPrice) return false
      return true
    })
  }, [works, medium, status, maxPrice])

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-gray-100">
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
        </div>
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

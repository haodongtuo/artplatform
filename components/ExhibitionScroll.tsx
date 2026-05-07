'use client'
import Link from 'next/link'
import { Exhibition } from '@/lib/supabase'

interface Props {
  exhibitions: Exhibition[]
}

const statusLabel: Record<string, { text: string; cls: string }> = {
  active:   { text: 'Now Open',  cls: 'bg-emerald-100 text-emerald-700' },
  upcoming: { text: 'Coming Soon', cls: 'bg-amber-100 text-amber-700' },
  closed:   { text: 'Closed',    cls: 'bg-gray-100 text-gray-500' },
}

export default function ExhibitionScroll({ exhibitions }: Props) {
  if (exhibitions.length === 0) return null

  // active 排前，upcoming 其次，closed 最后
  const sorted = [...exhibitions].sort((a, b) => {
    const order = { active: 0, upcoming: 1, closed: 2 }
    return (order[a.status] ?? 3) - (order[b.status] ?? 3)
  })

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="serif text-3xl font-light text-gray-900">Exhibitions</h2>
          <p className="text-gray-400 text-sm mt-1">Around the world, right now</p>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
        {sorted.map(ex => {
          const s = statusLabel[ex.status] || statusLabel.upcoming
          return (
            <Link
              key={ex.id}
              href={`/exhibition/${ex.slug}`}
              className="flex-shrink-0 w-72 rounded-2xl overflow-hidden border border-amber-100 bg-white hover:shadow-md transition-shadow group"
            >
              {/* Cover image or gradient placeholder */}
              <div className="h-36 relative overflow-hidden">
                {ex.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ex.cover_image} alt={ex.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 via-rose-100 to-yellow-100 flex items-center justify-center">
                    <span className="text-4xl opacity-30">🎨</span>
                  </div>
                )}
                <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>
                  {s.text}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="serif font-medium text-gray-900 text-base leading-snug mb-1 group-hover:text-amber-600 transition-colors">
                  {ex.name}
                </h3>
                <p className="text-xs text-gray-400 mb-2">{ex.school}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>📍 {ex.city}, {ex.country}</span>
                  {ex.date && (
                    <span>
                      {new Date(ex.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { Work } from '@/lib/supabase'

interface WorkCardProps {
  work: Work
  showArtist?: boolean
}

const statusLabel: Record<string, { label: string; cls: string }> = {
  available: { label: 'Available', cls: 'badge-available' },
  sold: { label: 'Sold', cls: 'badge-sold' },
  reserved: { label: 'Reserved', cls: 'badge-reserved' },
}

export default function WorkCard({ work, showArtist = true }: WorkCardProps) {
  const status = statusLabel[work.status] || statusLabel.available

  return (
    <Link href={`/work/${work.id}`} className="group block">
      <div className="work-card bg-white rounded-sm overflow-hidden border border-gray-100">
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
          {work.image_url ? (
            <Image
              src={work.image_url}
              alt={work.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-300 text-4xl serif italic">Art</span>
            </div>
          )}
          <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${status.cls}`}>
            {status.label}
          </span>
        </div>
        <div className="p-4">
          <h3 className="serif font-medium text-base leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
            {work.title}
          </h3>
          {showArtist && work.art_artists && (
            <p className="text-sm text-gray-500 mt-1">{work.art_artists.name}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">{work.medium}</span>
            <span className="text-base font-semibold text-black">${work.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

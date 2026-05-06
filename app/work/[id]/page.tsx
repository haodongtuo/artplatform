import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import BuyButton from '@/components/BuyButton'

export const revalidate = 60

async function getWork(id: string) {
  const { data } = await supabase
    .from('art_works')
    .select('*, art_artists(*)')
    .eq('id', id)
    .single()
  return data
}

export default async function WorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const work = await getWork(id)
  if (!work) notFound()

  const artist = work.art_artists
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://art-exhibition-2026.netlify.app'
  const workUrl = `${siteUrl}/work/${work.id}`

  const statusConfig = {
    available: { label: 'Available for Purchase', color: 'text-green-700 bg-green-50' },
    sold: { label: 'Sold', color: 'text-red-700 bg-red-50' },
    reserved: { label: 'Reserved', color: 'text-orange-700 bg-orange-50' },
  }
  const s = statusConfig[work.status as keyof typeof statusConfig] || statusConfig.available

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/gallery" className="text-sm text-gray-400 hover:text-black transition-colors mb-8 block">
        ← Back to Gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div>
          <div className="relative bg-gray-50 rounded-sm overflow-hidden aspect-[4/5]">
            {work.image_url ? (
              <Image
                src={work.image_url}
                alt={work.title}
                fill
                className="object-contain p-4"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="serif italic text-4xl text-gray-200">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {artist && (
            <Link href={`/artist/${artist.id}`} className="text-sm text-gray-500 hover:text-black transition-colors mb-3">
              {artist.name} · {artist.year}
            </Link>
          )}

          <h1 className="serif text-4xl font-light leading-tight mb-4">{work.title}</h1>

          <span className={`inline-flex self-start text-xs px-3 py-1 rounded-full font-medium mb-6 ${s.color}`}>
            {s.label}
          </span>

          <div className="text-3xl font-light mb-6">${work.price.toLocaleString()}</div>

          <div className="space-y-3 text-sm text-gray-600 mb-8 border-t border-b border-gray-100 py-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Medium</span>
              <span>{work.medium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dimensions</span>
              <span>{work.width_cm} × {work.height_cm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Year</span>
              <span>{work.year_created}</span>
            </div>
            {work.cert_id && (
              <div className="flex justify-between">
                <span className="text-gray-400">Certificate No.</span>
                <span className="font-mono text-xs">{work.cert_id}</span>
              </div>
            )}
          </div>

          {work.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-8">{work.description}</p>
          )}

          <BuyButton work={work} />

          {work.status === 'sold' && work.cert_id && (
            <Link
              href={`/certificate/${work.cert_id}`}
              className="mt-4 text-center text-sm text-gray-500 hover:text-black border border-gray-200 hover:border-black py-2.5 rounded-sm transition-colors"
            >
              View Certificate of Authenticity
            </Link>
          )}

          {/* QR Code */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Scan to share this artwork</p>
            <QRCodeDisplay url={workUrl} title={work.title} artist={artist?.name} />
          </div>
        </div>
      </div>
    </div>
  )
}

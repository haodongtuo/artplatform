import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import WorkCard from '@/components/WorkCard'

export const revalidate = 60

async function getArtist(id: string) {
  const { data } = await supabase
    .from('art_artists')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

async function getArtistWorks(artistId: string) {
  const { data } = await supabase
    .from('art_works')
    .select('*, art_artists(*)')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [artist, works] = await Promise.all([getArtist(id), getArtistWorks(id)])
  if (!artist) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/gallery" className="text-sm text-gray-400 hover:text-black transition-colors mb-8 block">
        ← Back to Gallery
      </Link>

      {/* Artist header */}
      <div className="flex flex-col md:flex-row gap-8 mb-16 pb-12 border-b border-gray-100">
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-100">
            {artist.photo_url ? (
              <Image src={artist.photo_url} alt={artist.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center serif text-5xl text-gray-300">
                {artist.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div>
          <h1 className="serif text-4xl font-light mb-2">{artist.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            {artist.school && <span>{artist.school}</span>}
            {artist.year && <span>Class of {artist.year}</span>}
            {artist.instagram && (
              <a
                href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black transition-colors"
              >
                @{artist.instagram.replace('@', '')}
              </a>
            )}
          </div>
          {artist.bio && (
            <p className="text-gray-600 leading-relaxed max-w-2xl">{artist.bio}</p>
          )}
        </div>
      </div>

      {/* Works */}
      <div>
        <div className="flex items-end justify-between mb-8">
          <h2 className="serif text-2xl font-light">Works</h2>
          <span className="text-sm text-gray-400">{works.length} piece{works.length !== 1 ? 's' : ''}</span>
        </div>
        {works.length === 0 ? (
          <p className="text-gray-400 serif italic">No works added yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {works.map(work => (
              <WorkCard key={work.id} work={work} showArtist={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

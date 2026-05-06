import type { Metadata, Viewport } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Art Exhibition 2026 | University Graduation Show',
  description: 'University Art Graduation Exhibition — May 21, 2026. Original works by graduating students, available for direct purchase.',
  openGraph: {
    title: 'Art Exhibition 2026',
    description: 'University Art Graduation Exhibition — May 21, 2026',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-gray-200 mt-20 py-10 text-center text-sm text-gray-400">
          <p className="serif italic">Art Exhibition 2026</p>
          <p className="mt-1">May 21, 2026</p>
        </footer>
      </body>
    </html>
  )
}

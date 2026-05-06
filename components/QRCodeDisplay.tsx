'use client'
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface Props {
  url: string
  title?: string
  artist?: string
  size?: number
}

export default function QRCodeDisplay({ url, title, artist, size = 160 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: { dark: '#111111', light: '#ffffff' },
      })
    }
  }, [url, size])

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <canvas ref={canvasRef} className="rounded-sm" />
      {title && <p className="text-xs text-gray-500 text-center max-w-[160px] leading-tight">{title}</p>}
      {artist && <p className="text-xs text-gray-400 text-center">{artist}</p>}
    </div>
  )
}

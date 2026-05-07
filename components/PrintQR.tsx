'use client'
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface Props {
  workUrl: string
  title: string
  artistName: string
  medium: string
  dimensions: string
  year: string
  price: number
  certId: string
}

export default function PrintQR({ workUrl, title, artistName, medium, dimensions, year, price, certId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, workUrl, {
        width: 280,
        margin: 2,
        color: { dark: '#111111', light: '#ffffff' },
      })
    }
  }, [workUrl])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-8 print:p-4">

      {/* Print button — hidden when printing */}
      <div className="print:hidden mb-8 text-center">
        <p className="text-gray-500 text-sm mb-4">Print this page and cut out the label. Attach it to the bottom-right corner of the artwork.</p>
        <button
          onClick={() => window.print()}
          className="bg-gray-900 text-white px-8 py-3 text-sm font-medium hover:bg-gray-700 transition-colors rounded-sm"
        >
          🖨️ Print Label
        </button>
      </div>

      {/* Label — this is what gets printed */}
      <div
        className="border-2 border-dashed border-gray-300 print:border-gray-400 rounded-lg p-8 max-w-sm w-full bg-white"
        style={{ pageBreakInside: 'avoid' }}
      >
        {/* Header */}
        <div className="text-center mb-6 pb-5 border-b border-gray-200">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-1">Before They Rise</p>
          <p className="text-[9px] text-gray-300">beforetheyrise.com</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <canvas ref={canvasRef} className="rounded" />
        </div>

        {/* Scan instruction */}
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-gray-800 mb-1">📱 Scan to View & Purchase</p>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Point your phone camera at the QR code to see full artwork details, artist story, and purchase securely online.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4"></div>

        {/* Artwork Info */}
        <div className="space-y-2">
          <div>
            <p className="text-base font-medium text-gray-900 serif leading-tight">{title}</p>
            <p className="text-sm text-gray-500">{artistName}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-gray-500 pt-2">
            {medium && (
              <>
                <span className="text-gray-400">Medium</span>
                <span>{medium}</span>
              </>
            )}
            {dimensions && (
              <>
                <span className="text-gray-400">Size</span>
                <span>{dimensions}</span>
              </>
            )}
            {year && (
              <>
                <span className="text-gray-400">Year</span>
                <span>{year}</span>
              </>
            )}
            {price > 0 && (
              <>
                <span className="text-gray-400">Price</span>
                <span className="font-medium text-gray-800">${price.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        {certId && (
          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-[9px] text-gray-300 font-mono">{certId}</p>
            <p className="text-[9px] text-gray-300 mt-0.5">Certificate of Authenticity included</p>
          </div>
        )}
      </div>

      {/* Instructions below label — hidden when printing */}
      <div className="print:hidden mt-10 max-w-sm text-center text-gray-400 text-xs leading-relaxed space-y-2">
        <p>✂️ Cut along the dashed border.</p>
        <p>📌 Attach to the <strong>bottom-right corner</strong> of your artwork at the exhibition.</p>
        <p>🎯 Visitors scan with any smartphone camera — no app needed.</p>
        <p>💳 They can view your full story and purchase directly on their phone.</p>
      </div>
    </div>
  )
}

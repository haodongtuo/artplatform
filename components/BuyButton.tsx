'use client'
import { useState } from 'react'
import { Work } from '@/lib/supabase'

interface Props {
  work: Work
}

export default function BuyButton({ work }: Props) {
  const [step, setStep] = useState<'idle' | 'form' | 'loading'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  if (work.status !== 'available') {
    return (
      <button disabled className="w-full py-4 bg-gray-100 text-gray-400 text-sm cursor-not-allowed rounded-sm">
        {work.status === 'sold' ? 'Sold · 已售出' : 'Reserved · 已预留'}
      </button>
    )
  }

  async function handleCheckout() {
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields · 请填写所有字段')
      return
    }
    setError('')
    setStep('loading')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workId: work.id, buyerName: name, buyerEmail: email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong · 出错了')
        setStep('form')
      }
    } catch {
      setError('Network error · 网络错误')
      setStep('form')
    }
  }

  if (step === 'idle') {
    return (
      <button
        onClick={() => setStep('form')}
        className="w-full py-4 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors rounded-sm"
      >
        Buy Now · 立即购买 — ${work.price.toLocaleString()}
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Your Name · 您的姓名"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
      />
      <input
        type="email"
        placeholder="Email Address · 电子邮箱"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={step === 'loading'}
        className="w-full py-4 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-300 rounded-sm"
      >
        {step === 'loading' ? 'Processing... · 处理中...' : `Proceed to Payment · 前往支付 — $${work.price.toLocaleString()}`}
      </button>
      <button
        onClick={() => setStep('idle')}
        className="w-full text-sm text-gray-400 hover:text-black transition-colors py-1"
      >
        Cancel · 取消
      </button>
    </div>
  )
}

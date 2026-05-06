import Link from 'next/link'

export default async function PurchaseSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ cert?: string }>
}) {
  const { cert } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="serif text-4xl font-light mb-3">Thank You!</h1>
        <p className="serif italic text-gray-500 mb-6">感谢您的购买</p>

        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          Your purchase is confirmed. You will receive a confirmation email shortly.
          <br /><br />
          您的购买已确认。您将很快收到确认邮件。
        </p>

        <div className="flex flex-col gap-3">
          {cert && (
            <Link
              href={`/certificate/${cert}`}
              className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              View Your Certificate · 查看收藏证书
            </Link>
          )}
          <Link
            href="/gallery"
            className="border border-gray-200 text-gray-600 px-8 py-3 text-sm hover:border-black hover:text-black transition-colors"
          >
            Browse More Works · 继续浏览
          </Link>
        </div>
      </div>
    </div>
  )
}

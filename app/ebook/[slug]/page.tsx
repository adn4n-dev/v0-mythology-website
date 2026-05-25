'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FlipbookViewer = dynamic(() => import('@/components/flipbook-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-20">
      <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
      <p className="text-gray-300">Okuyucu hazırlanıyor...</p>
    </div>
  ),
})

const magazines: Record<string, { title: string; pdfUrl: string; issueNumber: number }> = {
  'sayi-2': {
    title: 'ANKA Magazine - Felsefe Dergisi',
    pdfUrl: '/magazines/anka-sayi-2.pdf',
    issueNumber: 2,
  },
  'sayi-1': {
    title: 'ANKA Magazine - Felsefe Dergisi',
    pdfUrl: '/magazines/anka-sayi-1.pdf',
    issueNumber: 1,
  },
}

export default function EbookViewer() {
  const params = useParams()
  const slug = params.slug as string
  const magazine = magazines[slug]

  if (!magazine) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Dergi bulunamadı</h1>
          <Link href="/" className="text-primary hover:underline">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
      {/* Header */}
      <header className="bg-[#16213e] border-b border-[#0f3460] px-4 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft size={18} className="mr-2" />
                Geri
              </Button>
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-white font-serif text-lg">{magazine.title}</h1>
              <p className="text-gray-400 text-sm">Sayı {magazine.issueNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a href={magazine.pdfUrl} download>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Download size={18} className="mr-2" />
                <span className="hidden sm:inline">İndir</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* PDF Viewer — full remaining height, no scroll on page level */}
      <main className="flex-1 flex flex-col overflow-hidden px-4 pb-4">
        <FlipbookViewer pdfUrl={magazine.pdfUrl} />
      </main>
    </div>
  )
}

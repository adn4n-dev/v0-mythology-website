'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

const magazines: Record<string, { title: string; pdfUrl: string; issueNumber: number }> = {
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // PDF.js will be loaded via iframe
    setIsLoading(false)
  }, [])

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
      <header className="bg-[#16213e] border-b border-[#0f3460] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft size={18} className="mr-2" />
                Geri
              </Button>
            </Link>
            <div>
              <h1 className="text-white font-serif text-lg">{magazine.title}</h1>
              <p className="text-gray-400 text-sm">Sayı {magazine.issueNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a href={magazine.pdfUrl} download>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Download size={18} className="mr-2" />
                İndir
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl h-[calc(100vh-120px)] bg-white rounded-lg shadow-2xl overflow-hidden">
          <iframe
            src={`${magazine.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full h-full"
            title={magazine.title}
          />
        </div>
      </main>
    </div>
  )
}

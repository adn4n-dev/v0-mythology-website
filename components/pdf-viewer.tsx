'use client'

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  pdfUrl: string
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.2)
  const [pageWidth, setPageWidth] = useState<number>(800)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 80, 900)
      setPageWidth(width)
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
    setError(null)
  }

  function onDocumentLoadError(error: Error) {
    console.error('[v0] PDF load error:', error)
    setError('PDF yüklenemedi')
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages))
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5))

  return (
    <div className="flex flex-col items-center w-full">
      {/* PDF Document */}
      <div className="bg-white rounded-lg shadow-2xl overflow-auto mb-6 max-h-[calc(100vh-220px)]">
        {error ? (
          <div className="p-12 text-center text-red-600">
            <p className="font-medium">{error}</p>
            <p className="text-sm text-gray-600 mt-2">
              Lütfen sayfayı yenilemeyi deneyin
            </p>
          </div>
        ) : (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center p-20">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-gray-600">PDF yükleniyor...</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth * scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <div className="flex items-center justify-center p-20">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
              }
            />
          </Document>
        )}
      </div>

      {/* Controls */}
      {numPages > 0 && (
        <div className="bg-[#16213e] rounded-full px-4 py-2 flex items-center gap-2 shadow-lg border border-[#0f3460]">
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="text-white hover:bg-white/10"
            title="Uzaklaştır"
          >
            <ZoomOut size={18} />
          </Button>

          <span className="text-white text-sm min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 3}
            className="text-white hover:bg-white/10"
            title="Yakınlaştır"
          >
            <ZoomIn size={18} />
          </Button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="text-white hover:bg-white/10"
            title="Önceki sayfa"
          >
            <ChevronLeft size={18} />
          </Button>

          <span className="text-white text-sm font-medium min-w-[80px] text-center">
            {pageNumber} / {numPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="text-white hover:bg-white/10"
            title="Sonraki sayfa"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}

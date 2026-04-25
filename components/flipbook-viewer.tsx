"use client"

import { useState, useEffect, useRef, useCallback, forwardRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import HTMLFlipBook from "react-pageflip"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Use CDN for PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

interface FlipbookViewerProps {
  pdfUrl: string
}

interface PageProps {
  pageNumber: number
  width: number
}

// eslint-disable-next-line react/display-name
const FlipPage = forwardRef<HTMLDivElement, PageProps>(({ pageNumber, width }, ref) => {
  return (
    <div ref={ref} className="bg-white shadow-lg overflow-hidden">
      <Page
        pageNumber={pageNumber}
        width={width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading={
          <div className="flex items-center justify-center" style={{ width, height: width * 1.41 }}>
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        }
      />
    </div>
  )
})

export default function FlipbookViewer({ pdfUrl }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageWidth, setPageWidth] = useState(450)
  const [isLoading, setIsLoading] = useState(true)
  const flipBookRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate responsive page size
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      const containerHeight = window.innerHeight - 200

      // For two-page spread, each page should be half the container width
      // Maintain A4 ratio (1:1.41)
      let calculatedWidth = Math.min(containerWidth / 2 - 20, 600)

      // Make sure height fits in viewport
      const calculatedHeight = calculatedWidth * 1.41
      if (calculatedHeight > containerHeight) {
        calculatedWidth = containerHeight / 1.41
      }

      // On mobile, use single page
      if (containerWidth < 768) {
        calculatedWidth = Math.min(containerWidth - 40, 400)
      }

      setPageWidth(Math.floor(calculatedWidth))
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }, [])

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data + 1)
  }, [])

  const goToPrevPage = () => {
    flipBookRef.current?.pageFlip()?.flipPrev()
  }

  const goToNextPage = () => {
    flipBookRef.current?.pageFlip()?.flipNext()
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            <p className="text-gray-300">Dergi yükleniyor...</p>
          </div>
        }
        error={
          <div className="text-center p-20">
            <p className="text-red-400 mb-2">PDF yüklenemedi</p>
            <p className="text-gray-400 text-sm">Lütfen sayfayı yenileyin</p>
          </div>
        }
      >
        {numPages > 0 && (
          <>
            {/* Flipbook */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                onClick={goToPrevPage}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hidden md:flex"
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={32} />
              </Button>

              <div className="shadow-2xl">
                {/* @ts-ignore */}
                <HTMLFlipBook
                  ref={flipBookRef}
                  width={pageWidth}
                  height={pageWidth * 1.41}
                  size="fixed"
                  minWidth={300}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={1500}
                  drawShadow={true}
                  flippingTime={800}
                  usePortrait={isMobile}
                  startZIndex={0}
                  autoSize={false}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                  swipeDistance={30}
                  clickEventForward={true}
                  useMouseEvents={true}
                  renderOnlyPageLengthChange={false}
                  showPageCorners={true}
                  disableFlipByClick={false}
                  className="flipbook"
                  style={{}}
                  startPage={0}
                  onFlip={onFlip}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <FlipPage key={i} pageNumber={i + 1} width={pageWidth} />
                  ))}
                </HTMLFlipBook>
              </div>

              <Button
                onClick={goToNextPage}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hidden md:flex"
                disabled={currentPage >= numPages}
              >
                <ChevronRight size={32} />
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center justify-center gap-2 mb-4">
              <Button
                onClick={goToPrevPage}
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10 bg-transparent"
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                onClick={goToNextPage}
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10 bg-transparent"
                disabled={currentPage >= numPages}
              >
                <ChevronRight size={20} />
              </Button>
            </div>

            {/* Page Indicator */}
            <div className="text-center text-gray-300 text-sm">
              <span className="font-medium">{currentPage}</span>
              <span className="mx-2 text-gray-500">/</span>
              <span>{numPages}</span>
            </div>
          </>
        )}
      </Document>
    </div>
  )
}

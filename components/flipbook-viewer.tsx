"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, RotateCw } from "lucide-react"

interface FlipbookViewerProps {
  pdfUrl: string
}

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

const TOOLBAR_HEIGHT = 56  // header
const CONTROLS_HEIGHT = 100 // toolbar + bottom buttons

export default function FlipbookViewer({ pdfUrl }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [autoScale, setAutoScale] = useState(1)
  const [manualZoom, setManualZoom] = useState(0) // offset from auto
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pdfRef = useRef<any>(null)
  const renderTaskRef = useRef<any>(null)

  // Load PDF.js from CDN
  useEffect(() => {
    if ((window as any).pdfjsLib) {
      initPdf()
      return
    }
    const script = document.createElement("script")
    script.src = PDFJS_CDN
    script.onload = () => {
      ;(window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER
      initPdf()
    }
    script.onerror = () => {
      setStatus("error")
      setErrorMsg("PDF.js yüklenemedi")
    }
    document.head.appendChild(script)
  }, [])

  const initPdf = useCallback(async () => {
    try {
      setStatus("loading")
      const pdfjsLib = (window as any).pdfjsLib
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise
      pdfRef.current = pdf
      setNumPages(pdf.numPages)
      setStatus("ready")
    } catch (e: any) {
      setStatus("error")
      setErrorMsg(e?.message || "PDF açılamadı")
    }
  }, [pdfUrl])

  // Calculate auto scale to fit screen whenever ready or window resizes
  const calcAutoScale = useCallback(async () => {
    if (!pdfRef.current) return
    const page = await pdfRef.current.getPage(1)
    const viewport = page.getViewport({ scale: 1 })

    const availW = window.innerWidth - 32  // 16px padding each side
    const availH = window.innerHeight - TOOLBAR_HEIGHT - CONTROLS_HEIGHT

    const scaleByW = availW / viewport.width
    const scaleByH = availH / viewport.height
    const best = Math.min(scaleByW, scaleByH)
    setAutoScale(best)
    setScale(best + manualZoom)
  }, [manualZoom])

  useEffect(() => {
    if (status === "ready") {
      calcAutoScale()
    }
  }, [status, calcAutoScale])

  useEffect(() => {
    const onResize = () => {
      if (status === "ready") calcAutoScale()
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [status, calcAutoScale])

  const renderPage = useCallback(async (pageNum: number, sc: number) => {
    if (!pdfRef.current || !canvasRef.current || sc <= 0) return
    try {
      if (renderTaskRef.current) renderTaskRef.current.cancel()
      const page = await pdfRef.current.getPage(pageNum)
      const viewport = page.getViewport({ scale: sc })
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")!
      canvas.height = viewport.height
      canvas.width = viewport.width
      const renderTask = page.render({ canvasContext: ctx, viewport })
      renderTaskRef.current = renderTask
      await renderTask.promise
    } catch (e: any) {
      if (e?.name !== "RenderingCancelledException") {
        console.error("[v0] Render error:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (status === "ready" && scale > 0) {
      renderPage(currentPage, scale)
    }
  }, [status, currentPage, scale, renderPage])

  const goNext = () => { if (currentPage < numPages) setCurrentPage((p) => p + 1) }
  const goPrev = () => { if (currentPage > 1) setCurrentPage((p) => p - 1) }

  const zoomIn = () => {
    const next = manualZoom + 0.2
    setManualZoom(next)
    setScale(autoScale + next)
  }
  const zoomOut = () => {
    const next = manualZoom - 0.2
    setManualZoom(next)
    setScale(Math.max(autoScale + next, 0.3))
  }
  const resetZoom = () => {
    setManualZoom(0)
    setScale(autoScale)
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 bg-[#16213e] border border-white/10 rounded-xl px-4 py-2 shadow-lg flex-wrap justify-center">
        <button onClick={goPrev} disabled={currentPage <= 1}
          className="text-white disabled:opacity-30 hover:text-amber-400 transition-colors p-1">
          <ChevronLeft size={22} />
        </button>
        <span className="text-gray-300 text-sm min-w-[72px] text-center">
          {status === "ready" ? `${currentPage} / ${numPages}` : "—"}
        </span>
        <button onClick={goNext} disabled={currentPage >= numPages}
          className="text-white disabled:opacity-30 hover:text-amber-400 transition-colors p-1">
          <ChevronRight size={22} />
        </button>

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button onClick={zoomOut} className="text-white hover:text-amber-400 transition-colors p-1">
          <ZoomOut size={18} />
        </button>
        <button onClick={resetZoom} className="text-gray-400 hover:text-white text-xs w-12 text-center transition-colors">
          {Math.round(scale * 100)}%
        </button>
        <button onClick={zoomIn} className="text-white hover:text-amber-400 transition-colors p-1">
          <ZoomIn size={18} />
        </button>

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button onClick={initPdf} className="text-white hover:text-amber-400 transition-colors p-1" title="Yenile">
          <RotateCw size={16} />
        </button>
      </div>

      {/* Canvas Area — fills remaining vertical space, scrollable only if zoomed in */}
      <div
        ref={containerRef}
        className="flex-1 w-full overflow-auto flex items-start justify-center rounded-xl"
        style={{ maxHeight: `calc(100vh - ${TOOLBAR_HEIGHT + CONTROLS_HEIGHT}px)` }}
      >
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            <p className="text-gray-300">Dergi yükleniyor...</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <p className="text-red-400 mb-2 font-medium">PDF yüklenemedi</p>
            <p className="text-gray-400 text-sm mb-4">{errorMsg}</p>
            <button onClick={initPdf}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
              <RotateCw size={16} /> Tekrar Dene
            </button>
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{ display: status === "ready" ? "block" : "none", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}
        />
      </div>

      {/* Bottom nav */}
      {status === "ready" && numPages > 0 && (
        <div className="flex items-center gap-2 mt-3">
          <button onClick={goPrev} disabled={currentPage <= 1}
            className="flex items-center gap-1 bg-amber-700/80 hover:bg-amber-600 text-white disabled:opacity-30 px-4 py-2 rounded-lg text-sm transition-colors">
            <ChevronLeft size={16} /> Önceki
          </button>
          <button onClick={goNext} disabled={currentPage >= numPages}
            className="flex items-center gap-1 bg-amber-700/80 hover:bg-amber-600 text-white disabled:opacity-30 px-4 py-2 rounded-lg text-sm transition-colors">
            Sonraki <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

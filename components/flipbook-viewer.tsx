"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, RotateCw } from "lucide-react"

interface FlipbookViewerProps {
  pdfUrl: string
}

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

export default function FlipbookViewer({ pdfUrl }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.2)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

  const renderPage = useCallback(async (pageNum: number, sc: number) => {
    if (!pdfRef.current || !canvasRef.current) return
    try {
      // Cancel previous render
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
      }
      const page = await pdfRef.current.getPage(pageNum)
      const viewport = page.getViewport({ scale: sc })
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")!
      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = { canvasContext: ctx, viewport }
      const renderTask = page.render(renderContext)
      renderTaskRef.current = renderTask
      await renderTask.promise
    } catch (e: any) {
      if (e?.name !== "RenderingCancelledException") {
        console.error("[v0] Render error:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (status === "ready") {
      renderPage(currentPage, scale)
    }
  }, [status, currentPage, scale, renderPage])

  const goNext = () => {
    if (currentPage < numPages) setCurrentPage((p) => p + 1)
  }
  const goPrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1)
  }
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3))
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5))

  return (
    <div className="flex flex-col items-center w-full max-w-5xl">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 bg-[#16213e] border border-white/10 rounded-xl px-4 py-2 shadow-lg">
        <button
          onClick={goPrev}
          disabled={currentPage <= 1}
          className="text-white disabled:opacity-30 hover:text-amber-400 transition-colors p-1"
        >
          <ChevronLeft size={24} />
        </button>

        <span className="text-gray-300 text-sm min-w-[80px] text-center">
          {status === "ready" ? `${currentPage} / ${numPages}` : "—"}
        </span>

        <button
          onClick={goNext}
          disabled={currentPage >= numPages}
          className="text-white disabled:opacity-30 hover:text-amber-400 transition-colors p-1"
        >
          <ChevronRight size={24} />
        </button>

        <div className="w-px h-6 bg-white/20 mx-1" />

        <button onClick={zoomOut} className="text-white hover:text-amber-400 transition-colors p-1">
          <ZoomOut size={20} />
        </button>
        <span className="text-gray-400 text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} className="text-white hover:text-amber-400 transition-colors p-1">
          <ZoomIn size={20} />
        </button>

        <div className="w-px h-6 bg-white/20 mx-1" />

        <button onClick={initPdf} className="text-white hover:text-amber-400 transition-colors p-1" title="Yenile">
          <RotateCw size={18} />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="relative bg-[#111827] rounded-xl shadow-2xl overflow-auto max-h-[calc(100vh-220px)] max-w-full border border-white/10">
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center min-h-[500px] min-w-[360px]">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            <p className="text-gray-300">Dergi yükleniyor...</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center min-h-[500px] min-w-[360px] p-8">
            <p className="text-red-400 mb-2 font-medium">PDF yüklenemedi</p>
            <p className="text-gray-400 text-sm mb-4">{errorMsg}</p>
            <button
              onClick={initPdf}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RotateCw size={16} />
              Tekrar Dene
            </button>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={status === "ready" ? "block" : "hidden"}
          style={{ display: status === "ready" ? "block" : "none" }}
        />
      </div>

      {/* Page Jump Buttons (bottom) */}
      {status === "ready" && numPages > 0 && (
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={goPrev}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 bg-amber-700/80 hover:bg-amber-600 text-white disabled:opacity-30 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <ChevronLeft size={16} />
            Önceki Sayfa
          </button>
          <button
            onClick={goNext}
            disabled={currentPage >= numPages}
            className="flex items-center gap-1 bg-amber-700/80 hover:bg-amber-600 text-white disabled:opacity-30 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Sonraki Sayfa
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

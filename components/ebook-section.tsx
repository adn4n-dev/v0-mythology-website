'use client'

import Link from 'next/link'
import { BookOpen, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

const magazines = [
  {
    id: 1,
    slug: 'sayi-1',
    title: 'ANKA Magazine',
    subtitle: 'Felsefe Dergisi',
    issueNumber: 1,
    description: 'Varoluş, Türk mitolojisi, Çanakkale ruhu ve felsefenin derinliklerine yolculuk. Bu sayıda: İstiklal Marşı, Atatürk\'ün Gençliğe Hitabesi, 57. Alay, Fermi Paradoksu ve daha fazlası.',

  },
]

export default function EbookSection() {
  const latest = magazines[0]

  return (
    <section className="min-h-[calc(100vh-72px)] flex items-center bg-background px-4 py-12">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Magazine Cover */}
          <div className="w-full md:w-auto flex-shrink-0">
            <div className="relative w-72 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-border">
              {/* Cover */}
              <div className="h-96 bg-emerald-900 flex flex-col items-center justify-center p-8">
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>
                <svg className="relative z-10 w-24 h-24 text-amber-400 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C10.5 4 9 5.5 9 8c0 1.5.5 3 2 4-1.5-1-3-1-4 0-1 1-1 3 0 4 1 1 3 1 4 0-.5 1.5 0 3 1 4s3 1 4 0c1-1 1.5-2.5 1-4 1 1 3 1 4 0s1-3 0-4c-1-1-2.5-1-4 0 1.5-1 2-2.5 2-4 0-2.5-1.5-4-3-6-1 2-2 3-3 3s-2-1-3-3z"/>
                </svg>
                <h3 className="relative z-10 text-white font-serif text-2xl font-bold text-center">{latest.title}</h3>
                <p className="relative z-10 text-amber-300 text-sm mt-1 text-center">{latest.subtitle}</p>
                <div className="relative z-10 mt-4 px-4 py-1 bg-white/20 rounded-full">
                  <span className="text-white text-sm font-medium">Sayı {latest.issueNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
              Yeni Sayı
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {latest.title}
            </h1>
            <p className="text-primary font-medium text-lg mb-4">{latest.subtitle} — Sayı {latest.issueNumber}</p>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {latest.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href={`/ebook/${latest.slug}`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                  <Eye size={20} className="mr-2" />
                  Hemen Oku
                </Button>
              </Link>
              <Link href="/magazines">
                <Button size="lg" variant="outline" className="px-8">
                  <BookOpen size={20} className="mr-2" />
                  Tüm Sayılar
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

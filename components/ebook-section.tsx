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
    coverColor: 'from-emerald-800 to-emerald-950',
  },
]

export default function EbookSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/50" />
            <BookOpen className="w-6 h-6 text-primary" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
            Yeni Sayı
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            E-Kitap / Dergi
          </h2>
          <p className="text-muted-foreground mt-2">Anka Dergi sayılarını çevrimiçi okuyun</p>
        </div>

        {/* Magazines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {magazines.map((magazine) => (
            <div
              key={magazine.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-border"
            >
              {/* Cover */}
              <div className={`relative h-72 bg-gradient-to-br ${magazine.coverColor} flex flex-col items-center justify-center p-6`}>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>
                
                {/* Phoenix Logo */}
                <div className="relative z-10 mb-4">
                  <svg className="w-20 h-20 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C10.5 4 9 5.5 9 8c0 1.5.5 3 2 4-1.5-1-3-1-4 0-1 1-1 3 0 4 1 1 3 1 4 0-.5 1.5 0 3 1 4s3 1 4 0c1-1 1.5-2.5 1-4 1 1 3 1 4 0s1-3 0-4c-1-1-2.5-1-4 0 1.5-1 2-2.5 2-4 0-2.5-1.5-4-3-6-1 2-2 3-3 3s-2-1-3-3z"/>
                  </svg>
                </div>
                
                <h3 className="relative z-10 text-white font-serif text-2xl font-bold text-center">
                  {magazine.title}
                </h3>
                <p className="relative z-10 text-amber-300 text-sm mt-1">
                  {magazine.subtitle}
                </p>
                <div className="relative z-10 mt-3 px-4 py-1 bg-white/20 rounded-full">
                  <span className="text-white text-sm font-medium">
                    Sayı {magazine.issueNumber}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                  {magazine.description}
                </p>

                <Link href={`/ebook/${magazine.slug}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white group-hover:scale-105 transition-transform">
                    <Eye size={18} className="mr-2" />
                    Şimdi Oku
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

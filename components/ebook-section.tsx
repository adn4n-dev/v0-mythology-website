'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

const magazines = [
  {
    id: 2,
    slug: 'sayi-2',
    title: 'ANKA Magazine',
    subtitle: 'Felsefe Dergisi',
    issueNumber: 2,
    description: 'Bu sayıda: 19 Mayıs ve Milli Mücadele, İstanbul\'un Fethi, Alman İmparatorluğu\'nun Kuruluşu, Homeros\'un Tanrıları ve daha fazlası. Estetik, sanat ve tarihin derinliklerine dalın.',
    coverImage: '/magazines/anka-sayi-2-kapak.jpg',
  },
  {
    id: 1,
    slug: 'sayi-1',
    title: 'ANKA Magazine',
    subtitle: 'Felsefe Dergisi',
    issueNumber: 1,
    description: 'Varoluş, Türk mitolojisi, Çanakkale ruhu ve felsefenin derinliklerine yolculuk. Bu sayıda: İstiklal Marşı, Atatürk\'ün Gençliğe Hitabesi, 57. Alay, Fermi Paradoksu ve daha fazlası.',
    coverImage: '/magazines/anka-sayi-1-kapak.jpg',
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
            <Link href={`/ebook/${latest.slug}`}>
              <div className="relative w-72 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-border hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                <Image
                  src={latest.coverImage}
                  alt={`ANKA Magazine Sayı ${latest.issueNumber} Kapak`}
                  width={288}
                  height={408}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </Link>
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

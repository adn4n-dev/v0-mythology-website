'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BookOpen, Download, ExternalLink } from 'lucide-react';

interface Magazine {
  id: string
  title: string
  description: string
  issue_number: string
  pdf_url: string
  cover_url: string
  is_published: boolean
  created_at: string
}

export default function DergilerPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const response = await fetch('/api/magazines')
        if (!response.ok) throw new Error('Dergiler yüklenemedi')
        const data = await response.json()
        setMagazines(data)
      } catch (err) {
        setError('Dergiler yüklenirken bir hata oluştu.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMagazines()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Dergiler</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Anka Dergi'nin tüm sayılarına buradan ulaşabilirsiniz.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden shadow-sm border border-border animate-pulse">
                  <div className="aspect-[3/4] bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600">{error}</p>
            </div>
          ) : magazines.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-serif text-foreground mb-2">Henüz dergi yok</h2>
              <p className="text-muted-foreground">Yakında yeni sayılar eklenecek.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {magazines.map((magazine) => (
                <div
                  key={magazine.id}
                  className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow group"
                >
                  {/* Cover */}
                  <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                    {magazine.cover_url ? (
                      <img
                        src={magazine.cover_url}
                        alt={`${magazine.title} dergi kapağı`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/5 to-primary/20">
                        <BookOpen size={48} className="text-primary/40" />
                        <span className="text-xs text-muted-foreground font-medium px-4 text-center">{magazine.title}</span>
                      </div>
                    )}
                    {magazine.issue_number && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                        {magazine.issue_number}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-serif font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2">
                      {magazine.title}
                    </h3>
                    {magazine.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{magazine.description}</p>
                    )}
                    <div className="flex gap-2">
                      <a
                        href={magazine.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                      >
                        <ExternalLink size={12} />
                        Oku
                      </a>
                      <a
                        href={magazine.pdf_url}
                        download
                        className="flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                        title="İndir"
                      >
                        <Download size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

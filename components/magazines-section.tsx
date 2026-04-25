'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Magazine {
  id: string
  title: string
  description?: string
  pdf_url: string
  issue_number?: number
  is_published: boolean
  created_at: string
}

export default function MagazinesSection() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const response = await fetch('/api/magazines')
        if (response.ok) {
          const data = await response.json()
          setMagazines(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching magazines:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMagazines()
  }, [])

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/50" />
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
            </svg>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Anka Dergi - E-Kitap
          </h2>
          <p className="text-muted-foreground mt-2">Tüm sayıları çevrimiçi olarak okuyun</p>
        </div>

        {/* Magazines Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground">Dergiler yükleniyor...</div>
        ) : magazines.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            Henüz dergi bulunmamaktadır
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magazines.map((magazine) => (
              <div
                key={magazine.id}
                className="bg-card rounded-lg overflow-hidden shadow-lg border border-border hover:shadow-xl transition-shadow"
              >
                {/* Mock Cover */}
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-4">
                  <svg className="w-16 h-16 text-primary/40 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" />
                    <path d="M8 6h8M8 10h8M8 14h5" />
                  </svg>
                  <p className="text-center font-serif text-sm text-primary/60">{magazine.title}</p>
                  {magazine.issue_number && (
                    <p className="text-xs text-muted-foreground mt-2">Sayı {magazine.issue_number}</p>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2">
                    {magazine.title}
                  </h3>
                  {magazine.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {magazine.description}
                    </p>
                  )}

                  <Link
                    href={magazine.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      <Eye size={16} className="mr-2" />
                      Oku
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

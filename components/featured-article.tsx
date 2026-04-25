'use client'

import { useEffect, useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Article {
  id: string
  title: string
  description: string
  content: string
  slug: string
  image_url?: string
}

export function FeaturedArticle() {
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedArticle = async () => {
      try {
        const response = await fetch('/api/articles')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        
        // Get the first featured article or the first article
        const featured = data.find((a: any) => a.is_featured) || data[0]
        if (featured) {
          setArticle(featured)
        }
      } catch (error) {
        console.error('[v0] Error fetching featured article:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedArticle()
  }, [])

  if (isLoading || !article) {
    return (
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/50 p-8 text-center text-muted-foreground">
            Yükleniyor...
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/50">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 md:h-auto min-h-[300px] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {article.image_url ? (
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-6xl opacity-30">📖</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 md:bg-gradient-to-l md:from-card md:via-transparent md:to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">
                Öne Çıkan
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                {article.title}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                {article.description}
              </p>
              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 w-fit"
              >
                Devamını Oku
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

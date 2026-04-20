'use client'

import { useEffect, useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Article {
  id: string
  title: string
  description: string
  slug: string
  category: string
}

export function PopularArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles')
        const data = await response.json()
        setArticles(data.slice(0, 3))
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
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
            Popüler Yazılar
          </h2>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground">Yükleniyor...</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-muted-foreground">Makale bulunamadı</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-5xl opacity-30">📖</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">
                    {article.category}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
                  >
                    Devamını Oku
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

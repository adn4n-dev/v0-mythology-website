import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { PopularArticles } from "@/components/popular-articles"
import { FeaturedArticle } from "@/components/featured-article"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <PopularArticles />
      <FeaturedArticle />
      <Footer />
    </main>
  )
}

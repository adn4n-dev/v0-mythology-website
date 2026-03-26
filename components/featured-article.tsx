import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function FeaturedArticle() {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/50">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 md:h-auto min-h-[300px]">
              <Image
                src="/images/phoenix-fire.jpg"
                alt="Mitolojide Yeniden Doğuşun Gücü"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 md:bg-gradient-to-l md:from-card md:via-transparent md:to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                Mitolojide Yeniden
                <br />
                Doğuşun Gücü
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Dünya mitolojilerinde yeniden doğuş kavramı, insanlığın en derin umutlarını ve
                korkularını yansıtır. Anka kuşundan Phoenix&apos;e, ölümsüzlük arayışından
                ruhani dönüşüme kadar uzanan bu evrensel tema, farklı kültürlerde nasıl
                şekillenmiştir?
              </p>
              <Link
                href="/yazilar/yeniden-dogus"
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

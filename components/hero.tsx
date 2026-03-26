import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Antik tapınak manzarası"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
      </div>

      {/* Decorative Columns */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 lg:w-64 opacity-60">
        <Image
          src="/images/column-left.jpg"
          alt=""
          fill
          className="object-cover object-right"
        />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 lg:w-64 opacity-60">
        <Image
          src="/images/column-left.jpg"
          alt=""
          fill
          className="object-cover object-left scale-x-[-1]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 pt-20">
        {/* Phoenix Logo */}
        <div className="mb-8">
          <Image
            src="/images/phoenix-logo.jpg"
            alt="Anka Kuşu Logosu"
            width={180}
            height={180}
            className="mx-auto drop-shadow-2xl rounded-full"
          />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
          Fikirler Sınırların
          <br />
          <span className="text-primary">Ötesine Kanat Açar</span>
        </h1>

        {/* CTA Button */}
        <Link
          href="/yazilar"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-3 rounded-full font-medium text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-primary/30"
        >
          Yazıları Keşfet
          <ChevronRight size={20} />
        </Link>

        {/* Decorative Divider */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
      </div>
    </section>
  )
}

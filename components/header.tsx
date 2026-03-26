"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const navItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Yazılar", href: "/yazilar" },
  { label: "Mitoloji", href: "/mitoloji" },
  { label: "Kültür", href: "/kultur" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-sm tracking-wide"
              >
                {item.label}
                {index < navItems.length - 1 && (
                  <span className="ml-6 text-primary/40">·</span>
                )}
              </Link>
            ))}
          </div>
          
          {/* CTA Button */}
          <Link
            href="/kesif"
            className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Keşfe Başlayın
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Menü"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border p-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/kesif"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-full font-medium text-sm shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Keşfe Başlayın
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

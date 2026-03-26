import Image from "next/image"
import Link from "next/link"

const footerLinks = {
  yazilar: [
    { label: "Mitoloji", href: "/mitoloji" },
    { label: "Kültür", href: "/kultur" },
    { label: "Tarih", href: "/tarih" },
    { label: "Felsefe", href: "/felsefe" },
  ],
  kurumsal: [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "İletişim", href: "/iletisim" },
    { label: "Gizlilik Politikası", href: "/gizlilik" },
    { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-secondary/30 to-background border-t border-border/50">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/50" />
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
          </svg>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <Image
                src="/images/phoenix-logo.jpg"
                alt="Anka Dergi"
                width={48}
                height={48}
                className="rounded-full"
              />
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Anka Dergi
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Fikirler sınırların ötesine kanat açar. Mitoloji, kültür ve tarih hakkında
              derinlemesine yazılar.
            </p>
          </div>

          {/* Links - Yazılar */}
          <div className="text-center md:text-left">
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">
              Yazılar
            </h4>
            <ul className="space-y-2">
              {footerLinks.yazilar.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Kurumsal */}
          <div className="text-center md:text-left">
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">
              Kurumsal
            </h4>
            <ul className="space-y-2">
              {footerLinks.kurumsal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Anka Dergi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}

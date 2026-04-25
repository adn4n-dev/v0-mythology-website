import MagazinesSection from '@/components/magazines-section'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'E-Kitap & Dergiler - Anka Dergi',
  description: 'Anka Dergi sayılarını çevrimiçi olarak okuyun',
}

export default function MagazinesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <MagazinesSection />
      </main>
      <Footer />
    </>
  )
}

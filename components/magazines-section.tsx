'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Upload, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issue_number: '',
    file: null as File | null,
  })

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('admin_token') === 'verified'
    setIsAdmin(isAdminLoggedIn)

    // Fetch magazines
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file || !formData.title) return

    setUploading(true)
    try {
      // Upload PDF to Blob
      const formDataBlob = new FormData()
      formDataBlob.append('file', formData.file)
      formDataBlob.append('title', formData.title)

      const uploadResponse = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formDataBlob,
      })

      if (!uploadResponse.ok) throw new Error('PDF upload failed')

      const uploadData = await uploadResponse.json()

      // Save magazine metadata to Supabase
      const magazineResponse = await fetch('/api/magazines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          pdf_url: uploadData.url,
          issue_number: formData.issue_number ? parseInt(formData.issue_number) : null,
          is_published: true,
        }),
      })

      if (!magazineResponse.ok) throw new Error('Magazine creation failed')

      const newMagazine = await magazineResponse.json()
      setMagazines([newMagazine, ...magazines])
      setSuccessMessage('Dergi başarıyla yüklendi!')
      setTimeout(() => setSuccessMessage(''), 3000)

      // Reset form
      setFormData({ title: '', description: '', issue_number: '', file: null })
      setShowUploadForm(false)
    } catch (error) {
      console.error('[v0] Upload error:', error)
      alert('Upload başarısız')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu dergiyi silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/magazines/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMagazines(magazines.filter((m) => m.id !== id))
        setSuccessMessage('Dergi silindi!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('[v0] Delete error:', error)
      alert('Silme başarısız')
    }
  }

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

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Admin Upload Section */}
        {isAdmin && (
          <div className="mb-8 bg-card rounded-lg p-6 border border-primary/30">
            {!showUploadForm ? (
              <Button
                onClick={() => setShowUploadForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Upload size={18} className="mr-2" />
                Yeni Dergi Yükle
              </Button>
            ) : (
              <form onSubmit={handleUpload} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Dergi Başlığı"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Dergi Açıklaması (opsiyonel)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Sayı Numarası (opsiyonel)"
                  value={formData.issue_number}
                  onChange={(e) => setFormData({ ...formData, issue_number: e.target.value })}
                />
                <div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    required
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    variant="outline"
                  >
                    İptal
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

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

                  <div className="flex gap-2">
                    <Link
                      href={magazine.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        <Eye size={16} className="mr-2" />
                        Oku
                      </Button>
                    </Link>

                    {isAdmin && (
                      <Button
                        onClick={() => handleDelete(magazine.id)}
                        variant="outline"
                        className="px-3"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

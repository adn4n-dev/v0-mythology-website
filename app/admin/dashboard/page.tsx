'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit2, Trash2, LogOut, Upload } from 'lucide-react'

interface Article {
  id: string
  title: string
  description: string
  content: string
  slug: string
  category: string
  is_featured: boolean
  is_published: boolean
  created_at: string
}

interface Magazine {
  id: string
  title: string
  description?: string
  pdf_url: string
  issue_number?: number
  is_published: boolean
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'articles' | 'magazines'>('articles')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    slug: '',
    category: 'Genel',
    is_featured: false,
    is_published: true,
  })
  const [magazineFormData, setMagazineFormData] = useState({
    title: '',
    description: '',
    issue_number: '',
    file: null as File | null,
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }
    fetchArticles()
    fetchMagazines()
  }, [router])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles/admin', {
        headers: {
          'x-admin-token': 'verified',
        },
      })
      if (!response.ok) throw new Error('Makale yüklenemedi')
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('[v0] Error fetching articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMagazines = async () => {
    try {
      const response = await fetch('/api/magazines')
      if (!response.ok) throw new Error('Dergi yüklenemedi')
      const data = await response.json()
      setMagazines(data)
    } catch (error) {
      console.error('[v0] Error fetching magazines:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.slug) {
      alert('Lütfen tüm gerekli alanları doldurun')
      return
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId 
        ? `/api/articles/${editingId}`
        : '/api/articles'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'verified',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Kayıt başarısız')

      setSuccessMessage(editingId ? 'Makale başarıyla güncellendi!' : 'Makale başarıyla eklendi!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      fetchArticles()
      setShowForm(false)
      setEditingId(null)
      setFormData({
        title: '',
        description: '',
        content: '',
        slug: '',
        category: 'Genel',
        is_featured: false,
        is_published: true,
      })
    } catch (error) {
      alert('Hata: ' + (error as Error).message)
    }
  }

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      description: article.description,
      content: article.content,
      slug: article.slug,
      category: article.category,
      is_featured: article.is_featured,
      is_published: article.is_published,
    })
    setEditingId(article.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu makaleyi silmek istediğinize emin misiniz?')) return

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': 'verified',
        },
      })

      if (!response.ok) throw new Error('Silme başarısız')
      
      setSuccessMessage('Makale başarıyla silindi!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      fetchArticles()
    } catch (error) {
      alert('Hata: ' + (error as Error).message)
    }
  }

  const handleMagazineUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magazineFormData.file || !magazineFormData.title) {
      alert('Lütfen başlık ve PDF seçin')
      return
    }

    setUploading(true)
    try {
      // Upload PDF to Blob
      const formDataBlob = new FormData()
      formDataBlob.append('file', magazineFormData.file)
      formDataBlob.append('title', magazineFormData.title)

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
          title: magazineFormData.title,
          description: magazineFormData.description,
          pdf_url: uploadData.url,
          issue_number: magazineFormData.issue_number ? parseInt(magazineFormData.issue_number) : null,
          is_published: true,
        }),
      })

      if (!magazineResponse.ok) throw new Error('Magazine creation failed')

      setSuccessMessage('Dergi başarıyla yüklendi!')
      setTimeout(() => setSuccessMessage(''), 3000)
      setMagazineFormData({ title: '', description: '', issue_number: '', file: null })
      fetchMagazines()
    } catch (error) {
      console.error('[v0] Upload error:', error)
      alert('Upload başarısız: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleMagazineDelete = async (id: string) => {
    if (!confirm('Bu dergiyi silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/magazines/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Silme başarısız')
      
      setSuccessMessage('Dergi silindi!')
      setTimeout(() => setSuccessMessage(''), 3000)
      fetchMagazines()
    } catch (error) {
      console.error('[v0] Delete error:', error)
      alert('Silme başarısız: ' + (error as Error).message)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      content: '',
      slug: '',
      category: 'Genel',
      is_featured: false,
      is_published: true,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif text-foreground">Anka Dergi - Admin</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Çıkış Yap
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex justify-between items-center">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage('')}
              className="text-green-800 hover:text-green-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'articles'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Makaleler
          </button>
          <button
            onClick={() => setActiveTab('magazines')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'magazines'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            E-Kitaplar
          </button>
        </div>
        {/* Add Article Button */}
        <div className="mb-6">
          {!showForm && activeTab === 'articles' && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              <Plus size={18} />
              Yeni Makale Ekle
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && activeTab === 'articles' && (
          <div className="bg-card rounded-lg shadow-lg p-6 mb-8 border border-border">
            <h2 className="text-xl font-serif text-foreground mb-4">
              {editingId ? 'Makaleyi Düzenle' : 'Yeni Makale Ekle'}
            </h2>
            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Başlık *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Makale başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    URL Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="makale-basligi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Kısa Açıklama *
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Makale açıklaması"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  İçerik
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Makale içeriği"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Kategori
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="Kategori"
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_featured: e.target.checked,
                        })
                      }
                    />
                    <span className="text-sm font-medium text-foreground">
                      Öne çıkan makale
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_published: e.target.checked,
                        })
                      }
                    />
                    <span className="text-sm font-medium text-foreground">
                      Yayınla
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {editingId ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  İptal
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Articles List */}
        {activeTab === 'articles' && (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-serif text-foreground">
              Makaleler ({articles.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">
              Yükleniyor...
            </div>
          ) : articles.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Henüz makale yok
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                      Başlık
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {article.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {article.slug}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {article.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {article.is_published && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                              Yayınlı
                            </span>
                          )}
                          {article.is_featured && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              Öne Çıkan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="text-primary hover:text-primary/80 transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* Magazines Section */}
        {activeTab === 'magazines' && (
        <div className="space-y-6">
          {/* Magazine Upload Form */}
          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <h2 className="text-xl font-serif text-foreground mb-4">Yeni Dergi Yükle</h2>
            <form onSubmit={handleMagazineUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Dergi Başlığı *
                  </label>
                  <Input
                    type="text"
                    placeholder="Anka Dergi - Sayı 1"
                    value={magazineFormData.title}
                    onChange={(e) => setMagazineFormData({ ...magazineFormData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Sayı Numarası
                  </label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={magazineFormData.issue_number}
                    onChange={(e) => setMagazineFormData({ ...magazineFormData, issue_number: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Açıklama
                </label>
                <Textarea
                  placeholder="Dergi açıklaması"
                  value={magazineFormData.description}
                  onChange={(e) => setMagazineFormData({ ...magazineFormData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  PDF Dosyası *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setMagazineFormData({ ...magazineFormData, file: e.target.files?.[0] || null })}
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
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                >
                  <Upload size={18} />
                  {uploading ? 'Yükleniyor...' : 'Yükle'}
                </Button>
              </div>
            </form>
          </div>

          {/* Magazines List */}
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-serif text-foreground">
                Dergiler ({magazines.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="p-6 text-center text-muted-foreground">Yükleniyor...</div>
            ) : magazines.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">Henüz dergi yok</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                        Başlık
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                        Sayı
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {magazines.map((magazine) => (
                      <tr key={magazine.id} className="border-b border-border hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">{magazine.title}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {magazine.issue_number ? `Sayı ${magazine.issue_number}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(magazine.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleMagazineDelete(magazine.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        )}
      </main>
    </div>
  )
}

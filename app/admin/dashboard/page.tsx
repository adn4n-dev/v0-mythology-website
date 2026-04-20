'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit2, Trash2, LogOut } from 'lucide-react'

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

export default function AdminDashboard() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    slug: '',
    category: 'Genel',
    is_featured: false,
    is_published: true,
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }
    fetchArticles()
  }, [router])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles/admin')
      if (!response.ok) throw new Error('Makale yüklenemedi')
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
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
      fetchArticles()
    } catch (error) {
      alert('Hata: ' + (error as Error).message)
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
        {/* Add Article Button */}
        <div className="mb-6">
          {!showForm && (
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
        {showForm && (
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
      </main>
    </div>
  )
}

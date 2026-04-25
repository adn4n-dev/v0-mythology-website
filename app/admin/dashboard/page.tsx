'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, LogOut, BookOpen, FileText, Upload, X } from 'lucide-react';

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
  description: string
  issue_number: string
  pdf_url: string
  cover_url: string
  is_published: boolean
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'articles' | 'magazines'>('articles')

  // Articles state
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoadingArticles, setIsLoadingArticles] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [articleForm, setArticleForm] = useState({
    title: '',
    description: '',
    content: '',
    slug: '',
    category: 'Genel',
    is_featured: false,
    is_published: true,
  })

  // Magazines state
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [isLoadingMagazines, setIsLoadingMagazines] = useState(true)
  const [showMagazineForm, setShowMagazineForm] = useState(false)
  const [magazineForm, setMagazineForm] = useState({
    title: '',
    description: '',
    issue_number: '',
    is_published: true,
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

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
      const response = await fetch('/api/articles/admin')
      if (!response.ok) throw new Error('Makale yüklenemedi')
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const fetchMagazines = async () => {
    try {
      const response = await fetch('/api/magazines', {
        headers: { 'x-admin-token': 'verified' },
      })
      if (!response.ok) throw new Error('Dergi yüklenemedi')
      const data = await response.json()
      setMagazines(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoadingMagazines(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }

  // Article handlers
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!articleForm.title || !articleForm.description || !articleForm.slug) {
      alert('Lütfen tüm gerekli alanları doldurun')
      return
    }
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/articles/${editingId}` : '/api/articles'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': 'verified' },
        body: JSON.stringify(articleForm),
      })
      if (!response.ok) throw new Error('Kayıt başarısız')
      fetchArticles()
      setShowArticleForm(false)
      setEditingId(null)
      setArticleForm({ title: '', description: '', content: '', slug: '', category: 'Genel', is_featured: false, is_published: true })
    } catch (error) {
      alert('Hata: ' + (error as Error).message)
    }
  }

  const handleEditArticle = (article: Article) => {
    setArticleForm({
      title: article.title,
      description: article.description,
      content: article.content,
      slug: article.slug,
      category: article.category,
      is_featured: article.is_featured,
      is_published: article.is_published,
    })
    setEditingId(article.id)
    setShowArticleForm(true)
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Bu makaleyi silmek istediğinize emin misiniz?')) return
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': 'verified' },
      })
      if (!response.ok) throw new Error('Silme başarısız')
      fetchArticles()
    } catch (error) {
      alert('Hata: ' + (error as Error).message)
    }
  }

  // Magazine handlers
  const uploadFile = async (file: File, type: 'pdf' | 'cover'): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    const response = await fetch('/api/magazines/upload', {
      method: 'POST',
      headers: { 'x-admin-token': 'verified' },
      body: formData,
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'Yükleme başarısız')
    }
    const data = await response.json()
    return data.url
  }

  const handleSaveMagazine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magazineForm.title) {
      alert('Dergi başlığı zorunludur')
      return
    }
    if (!pdfFile) {
      alert('PDF dosyası zorunludur')
      return
    }

    setIsUploading(true)
    try {
      setUploadProgress('PDF yükleniyor...')
      const pdfUrl = await uploadFile(pdfFile, 'pdf')

      let coverUrl = ''
      if (coverFile) {
        setUploadProgress('Kapak görseli yükleniyor...')
        coverUrl = await uploadFile(coverFile, 'cover')
      }

      setUploadProgress('Dergi kaydediliyor...')
      const response = await fetch('/api/magazines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': 'verified' },
        body: JSON.stringify({
          ...magazineForm,
          pdf_url: pdfUrl,
          cover_url: coverUrl,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Kayıt başarısız')
      }

      fetchMagazines()
      setShowMagazineForm(false)
      setMagazineForm({ title: '', description: '', issue_number: '', is_published: true })
      setPdfFile(null)
      setCoverFile(null)
      setUploadProgress('')
    } catch (error) {
      alert('Hata: ' + (error as Error).message)
    } finally {
      setIsUploading(false)
      setUploadProgress('')
    }
  }

  const handleDeleteMagazine = async (id: string) => {
    if (!confirm('Bu dergiyi silmek istediğinize emin misiniz?')) return
    try {
      const response = await fetch(`/api/magazines/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': 'verified' },
      })
      if (!response.ok) throw new Error('Silme başarısız')
      fetchMagazines()
    } catch (error) {
      alert('Hata: ' + (error as Error).message)
    }
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      const response = await fetch(`/api/magazines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': 'verified' },
        body: JSON.stringify({ is_published: !current }),
      })
      if (!response.ok) throw new Error('Güncelleme başarısız')
      fetchMagazines()
    } catch (error) {
      alert('Hata: ' + (error as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif text-foreground">Anka Dergi - Admin</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={18} />
            Çıkış Yap
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'articles' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText size={16} />
            Makaleler
          </button>
          <button
            onClick={() => setActiveTab('magazines')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'magazines' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen size={16} />
            Dergiler
          </button>
        </div>

        {/* ===== ARTICLES TAB ===== */}
        {activeTab === 'articles' && (
          <>
            <div className="mb-6">
              {!showArticleForm && (
                <Button
                  onClick={() => setShowArticleForm(true)}
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                >
                  <Plus size={18} />
                  Yeni Makale Ekle
                </Button>
              )}
            </div>

            {showArticleForm && (
              <div className="bg-card rounded-lg shadow-lg p-6 mb-8 border border-border">
                <h2 className="text-xl font-serif text-foreground mb-4">
                  {editingId ? 'Makaleyi Düzenle' : 'Yeni Makale Ekle'}
                </h2>
                <form onSubmit={handleSaveArticle} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Başlık *</label>
                      <Input
                        value={articleForm.title}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        placeholder="Makale başlığı"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">URL Slug *</label>
                      <Input
                        value={articleForm.slug}
                        onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })}
                        placeholder="makale-basligi"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Kısa Açıklama *</label>
                    <Input
                      value={articleForm.description}
                      onChange={(e) => setArticleForm({ ...articleForm, description: e.target.value })}
                      placeholder="Makale açıklaması"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">İçerik</label>
                    <Textarea
                      value={articleForm.content}
                      onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                      placeholder="Makale içeriği"
                      rows={6}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Kategori</label>
                      <Input
                        value={articleForm.category}
                        onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                        placeholder="Kategori"
                      />
                    </div>
                    <div className="flex gap-4 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={articleForm.is_featured}
                          onChange={(e) => setArticleForm({ ...articleForm, is_featured: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-foreground">Öne çıkan makale</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={articleForm.is_published}
                          onChange={(e) => setArticleForm({ ...articleForm, is_published: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-foreground">Yayınla</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                      {editingId ? 'Güncelle' : 'Ekle'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowArticleForm(false)
                        setEditingId(null)
                        setArticleForm({ title: '', description: '', content: '', slug: '', category: 'Genel', is_featured: false, is_published: true })
                      }}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-serif text-foreground">Makaleler ({articles.length})</h2>
              </div>
              {isLoadingArticles ? (
                <div className="p-6 text-center text-muted-foreground">Yükleniyor...</div>
              ) : articles.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">Henüz makale yok</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Başlık</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Kategori</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Durum</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-foreground">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr key={article.id} className="border-b border-border hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{article.title}</p>
                              <p className="text-sm text-muted-foreground">{article.slug}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{article.category}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {article.is_published && (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Yayınlı</span>
                              )}
                              {article.is_featured && (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Öne Çıkan</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditArticle(article)}
                                className="text-primary hover:text-primary/80 transition-colors"
                                title="Düzenle"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(article.id)}
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
          </>
        )}

        {/* ===== MAGAZINES TAB ===== */}
        {activeTab === 'magazines' && (
          <>
            <div className="mb-6">
              {!showMagazineForm && (
                <Button
                  onClick={() => setShowMagazineForm(true)}
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                >
                  <Plus size={18} />
                  Yeni Dergi Yükle
                </Button>
              )}
            </div>

            {showMagazineForm && (
              <div className="bg-card rounded-lg shadow-lg p-6 mb-8 border border-border">
                <h2 className="text-xl font-serif text-foreground mb-4">Yeni Dergi Yükle</h2>
                <form onSubmit={handleSaveMagazine} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Dergi Başlığı *</label>
                      <Input
                        value={magazineForm.title}
                        onChange={(e) => setMagazineForm({ ...magazineForm, title: e.target.value })}
                        placeholder="Dergi adı"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Sayı No</label>
                      <Input
                        value={magazineForm.issue_number}
                        onChange={(e) => setMagazineForm({ ...magazineForm, issue_number: e.target.value })}
                        placeholder="Örn: Sayı 12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Açıklama</label>
                    <Textarea
                      value={magazineForm.description}
                      onChange={(e) => setMagazineForm({ ...magazineForm, description: e.target.value })}
                      placeholder="Dergi hakkında kısa açıklama"
                      rows={3}
                    />
                  </div>

                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">PDF Dosyası *</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                      {pdfFile ? (
                        <div className="flex items-center justify-between bg-muted rounded p-2">
                          <span className="text-sm text-foreground truncate">{pdfFile.name}</span>
                          <button type="button" onClick={() => setPdfFile(null)} className="text-muted-foreground hover:text-foreground ml-2">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2 py-2">
                          <Upload size={24} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">PDF dosyası seçin</span>
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Kapak Görseli (isteğe bağlı)</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                      {coverFile ? (
                        <div className="flex items-center justify-between bg-muted rounded p-2">
                          <span className="text-sm text-foreground truncate">{coverFile.name}</span>
                          <button type="button" onClick={() => setCoverFile(null)} className="text-muted-foreground hover:text-foreground ml-2">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2 py-2">
                          <Upload size={24} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Kapak görseli seçin (JPG, PNG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={magazineForm.is_published}
                        onChange={(e) => setMagazineForm({ ...magazineForm, is_published: e.target.checked })}
                      />
                      <span className="text-sm font-medium text-foreground">Hemen yayınla</span>
                    </label>
                  </div>

                  {uploadProgress && (
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                      {uploadProgress}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isUploading} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                      <Upload size={16} />
                      {isUploading ? 'Yükleniyor...' : 'Dergi Yükle'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      onClick={() => {
                        setShowMagazineForm(false)
                        setMagazineForm({ title: '', description: '', issue_number: '', is_published: true })
                        setPdfFile(null)
                        setCoverFile(null)
                      }}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-serif text-foreground">Dergiler ({magazines.length})</h2>
              </div>
              {isLoadingMagazines ? (
                <div className="p-6 text-center text-muted-foreground">Yükleniyor...</div>
              ) : magazines.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">Henüz dergi yok</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Dergi</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Sayı</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Durum</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-foreground">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {magazines.map((magazine) => (
                        <tr key={magazine.id} className="border-b border-border hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {magazine.cover_url ? (
                                <img
                                  src={magazine.cover_url}
                                  alt={`${magazine.title} kapak görseli`}
                                  className="w-10 h-14 object-cover rounded shadow-sm"
                                />
                              ) : (
                                <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                                  <BookOpen size={16} className="text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-foreground">{magazine.title}</p>
                                {magazine.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">{magazine.description}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{magazine.issue_number || '-'}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleTogglePublish(magazine.id, magazine.is_published)}
                              className={`inline-block px-2 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
                                magazine.is_published
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' :'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {magazine.is_published ? 'Yayınlı' : 'Taslak'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <a
                                href={magazine.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors text-xs underline"
                              >
                                PDF Görüntüle
                              </a>
                              <button
                                onClick={() => handleDeleteMagazine(magazine.id)}
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
          </>
        )}
      </main>
    </div>
  )
}

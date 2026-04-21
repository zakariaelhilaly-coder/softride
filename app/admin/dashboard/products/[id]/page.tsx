'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Category { id: number; name: string; slug: string }

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [form, setForm] = useState({
    name: '', category_id: '', price: '', old_price: '',
    speed: '', range: '', badge: '', description: '',
    stock: '10', featured: false, images: [] as string[],
  })

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories)
    fetch(`/api/admin/products/${id}`).then(r => {
      if (r.status === 401) { router.push('/admin'); return null }
      return r.json()
    }).then(data => {
      if (!data) return
      setForm({
        name: data.name || '',
        category_id: data.category_id?.toString() || '',
        price: data.price?.toString() || '',
        old_price: data.old_price?.toString() || '',
        speed: data.speed?.toString() || '',
        range: data.range?.toString() || '',
        badge: data.badge || '',
        description: data.description || '',
        stock: data.stock?.toString() || '10',
        featured: Boolean(data.featured),
        images: JSON.parse(data.images || '[]'),
      })
    })
  }, [id, router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.filename) setForm(f => ({ ...f, images: [...f.images, data.filename] }))
    setUploadingImg(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        category_id: form.category_id ? Number(form.category_id) : null,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        speed: form.speed ? Number(form.speed) : null,
        range: form.range ? Number(form.range) : null,
        badge: form.badge || null,
        description: form.description || null,
        stock: Number(form.stock),
        featured: form.featured,
        images: form.images,
      }),
    })
    if (res.ok) router.push('/admin/dashboard/products')
    else { alert('Erreur'); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark text-white px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">⚙️ Softride Admin</span>
        <Link href="/" className="text-sm text-gray-300 hover:text-white">👁️ Voir le site</Link>
      </header>
      <div className="flex">
        <aside className="w-56 bg-white h-[calc(100vh-60px)] sticky top-0 border-r p-4">
          <nav className="space-y-1">
            {[
              { href: '/admin/dashboard', icon: '📊', label: 'Tableau de bord' },
              { href: '/admin/dashboard/products', icon: '📦', label: 'Produits' },
              { href: '/admin/dashboard/categories', icon: '🗂️', label: 'Catégories' },
              { href: '/admin/dashboard/settings', icon: '⚙️', label: 'Paramètres' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-primary transition-colors">
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/admin/dashboard/products" className="text-gray-400 hover:text-dark">← Retour</Link>
            <h1 className="text-2xl font-bold text-dark">Modifier le produit</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl p-6 shadow-sm border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 group">
                    <img src={`/images/products/${img}`} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">✕</button>
                  </div>
                ))}
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-2xl text-gray-400">{uploadingImg ? '⏳' : '+'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select value={form.category_id} onChange={e => setForm(f => ({...f, category_id: e.target.value}))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary">
                  <option value="">Aucune</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                <select value={form.badge} onChange={e => setForm(f => ({...f, badge: e.target.value}))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary">
                  <option value="">Aucun</option>
                  {['PROMO', 'NOUVEAU', 'TOP VENTE', 'STOCK LIMITÉ'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (MAD) *</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ancien prix</label>
                <input type="number" value={form.old_price} onChange={e => setForm(f => ({...f, old_price: e.target.value}))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vitesse (km/h)</label>
                <input type="number" value={form.speed} onChange={e => setForm(f => ({...f, speed: e.target.value}))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autonomie (km)</label>
                <input type="number" value={form.range} onChange={e => setForm(f => ({...f, range: e.target.value}))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary resize-none" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({...f, featured: e.target.checked}))} className="w-4 h-4 accent-primary" />
              <span className="text-sm text-gray-700">Produit vedette (homepage)</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex-1 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50">
                {loading ? 'Enregistrement...' : '✅ Enregistrer'}
              </button>
              <Link href="/admin/dashboard/products" className="px-6 py-3 border-2 rounded-xl font-medium hover:bg-gray-50 text-center">
                Annuler
              </Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category { id: number; name: string; slug: string; icon: string }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCat, setNewCat] = useState({ name: '', slug: '', icon: '🛴' })
  const [adding, setAdding] = useState(false)
  const router = useRouter()

  const fetchCats = () => {
    fetch('/api/admin/categories').then(r => {
      if (r.status === 401) { router.push('/admin'); return [] }
      return r.json()
    }).then(data => { if (Array.isArray(data)) setCategories(data) })
  }
  useEffect(fetchCats, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    })
    setNewCat({ name: '', slug: '', icon: '🛴' })
    setAdding(false)
    fetchCats()
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    fetchCats()
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
          <h1 className="text-2xl font-bold text-dark mb-6">Catégories</h1>

          {/* Add form */}
          <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
            <h2 className="font-semibold text-dark mb-4">Ajouter une catégorie</h2>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <input value={newCat.icon} onChange={e => setNewCat(f => ({...f, icon: e.target.value}))} placeholder="Icône 🛴"
                className="border-2 border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-primary" />
              <input value={newCat.name} onChange={e => setNewCat(f => ({...f, name: e.target.value}))} placeholder="Nom" required
                className="border-2 border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-primary" />
              <input value={newCat.slug} onChange={e => setNewCat(f => ({...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')}))} placeholder="slug" required
                className="border-2 border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-primary" />
            </div>
            <button type="submit" disabled={adding} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
              {adding ? 'Ajout...' : '➕ Ajouter'}
            </button>
          </form>

          {/* List */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between px-4 py-3 border-b last:border-0 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <p className="font-medium text-dark">{cat.name}</p>
                    <p className="text-xs text-gray-400">/{cat.slug}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-lg">
                  Supprimer
                </button>
              </div>
            ))}
            {categories.length === 0 && <div className="text-center py-8 text-gray-400">Aucune catégorie</div>}
          </div>
        </main>
      </div>
    </div>
  )
}

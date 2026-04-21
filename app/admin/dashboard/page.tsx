'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products').then(r => {
        if (r.status === 401) { router.push('/admin'); return [] }
        return r.json()
      }),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([products, categories]) => {
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
      })
      setLoading(false)
    })
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-dark text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <span className="font-bold text-lg">Softride Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
            👁️ Voir le site
          </Link>
          <button onClick={handleLogout} className="text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg transition-colors">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white h-[calc(100vh-60px)] sticky top-0 border-r shadow-sm p-4">
          <nav className="space-y-1">
            {[
              { href: '/admin/dashboard', icon: '📊', label: 'Tableau de bord' },
              { href: '/admin/dashboard/products', icon: '📦', label: 'Produits' },
              { href: '/admin/dashboard/categories', icon: '🗂️', label: 'Catégories' },
              { href: '/admin/dashboard/settings', icon: '⚙️', label: 'Paramètres' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-primary transition-colors"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-dark mb-8">Tableau de bord</h1>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: '📦', value: stats.products, label: 'Produits', color: 'bg-blue-50 text-blue-600' },
                { icon: '🗂️', value: stats.categories, label: 'Catégories', color: 'bg-green-50 text-green-600' },
                { icon: '💬', value: '—', label: 'Commandes WA', color: 'bg-yellow-50 text-yellow-600' },
                { icon: '⭐', value: '5.0', label: 'Note moyenne', color: 'bg-orange-50 text-orange-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
                  <div className="text-2xl font-bold text-dark">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-bold text-dark mb-4">Actions rapides</h2>
              <div className="space-y-3">
                <Link href="/admin/dashboard/products/new" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  ➕ Ajouter un produit
                </Link>
                <Link href="/admin/dashboard/categories" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  🗂️ Gérer les catégories
                </Link>
                <Link href="/admin/dashboard/settings" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  ⚙️ Modifier les paramètres
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-bold text-dark mb-4">Informations</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🌐 Site: <span className="font-medium">Softride.ma</span></p>
                <p>📱 WhatsApp: <span className="font-medium">+212 7 70 89 22 79</span></p>
                <p>📍 Zone: <span className="font-medium">Rabat • Salé • Kénitra</span></p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

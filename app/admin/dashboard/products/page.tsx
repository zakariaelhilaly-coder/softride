'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  price: number
  old_price: number | null
  images: string
  badge: string | null
  stock: number
  featured: number
  category_name: string | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProducts = () => {
    fetch('/api/admin/products').then(r => {
      if (r.status === 401) { router.push('/admin'); return [] }
      return r.json()
    }).then(data => {
      if (Array.isArray(data)) setProducts(data)
      setLoading(false)
    })
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark text-white px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">⚙️ Softride Admin</span>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-300 hover:text-white">👁️ Voir le site</Link>
        </div>
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

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-dark">Produits ({products.length})</h1>
            <Link href="/admin/dashboard/products/new" className="bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors text-sm">
              ➕ Ajouter un produit
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Produit</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Catégorie</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Prix</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Stock</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(p => {
                    const imgs: string[] = JSON.parse(p.images || '[]')
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {imgs[0] && <Image src={`/images/products/${imgs[0]}`} alt={p.name} fill className="object-cover" />}
                            </div>
                            <div>
                              <p className="font-medium text-dark line-clamp-1">{p.name}</p>
                              {p.badge && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.category_name || '—'}</td>
                        <td className="px-4 py-3 font-semibold text-primary">{p.price.toLocaleString()} MAD</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.stock > 0 ? p.stock : 'Épuisé'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link href={`/admin/dashboard/products/${p.id}`} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded-lg">Modifier</Link>
                            <button onClick={() => handleDelete(p.id, p.name)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-lg">Supprimer</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">📦</div>
                  <p>Aucun produit. <Link href="/admin/dashboard/products/new" className="text-primary hover:underline">Ajouter le premier</Link></p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

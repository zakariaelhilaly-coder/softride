'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartSidebar from '@/components/CartSidebar'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: number
  name: string
  price: number
  old_price: number | null
  images: string
  badge: string | null
  speed: number | null
  range: number | null
  description: string | null
  category_name: string | null
  category_slug: string | null
}

interface Category {
  id: number
  name: string
  slug: string
  icon: string
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [searchInput, setSearchInput] = useState(q)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchInput) params.set('q', searchInput)
    if (selectedCategory) params.set('category', selectedCategory)
    fetch(`/api/products?${params}`).then(r => r.json()).then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [searchInput, selectedCategory])

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    return 0
  })

  return (
    <>
      <Header />
      <CartSidebar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark">
            {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'Produits' : 'Tous les produits'}
          </h1>
          {q && <p className="text-gray-500 text-sm mt-1">Résultats pour &ldquo;{q}&rdquo;</p>}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold text-dark mb-3">Catégories</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                  >
                    Tous les produits
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <p className="text-sm text-gray-500">{sorted.length} produit{sorted.length !== 1 ? 's' : ''}</p>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1.5 outline-none focus:border-primary"
              >
                <option value="newest">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">🔍</div>
                <p className="font-medium">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sorted.map(p => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    price={p.price}
                    oldPrice={p.old_price}
                    images={JSON.parse(p.images || '[]')}
                    badge={p.badge}
                    speed={p.speed}
                    range={p.range}
                    description={p.description}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <ProductsContent />
    </Suspense>
  )
}

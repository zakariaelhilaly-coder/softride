import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartSidebar from '@/components/CartSidebar'
import ImageCarousel from '@/components/ImageCarousel'
import AddToCartButton from './AddToCartButton'
import getDb, { Product } from '@/lib/db'

export const dynamic = 'force-dynamic'

function getProduct(id: string): Product | null {
  const db = getDb()
  return db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).get(id) as Product | null
}

function getRelated(categoryId: number | null, excludeId: number): Product[] {
  if (!categoryId) return []
  const db = getDb()
  return db.prepare(`
    SELECT p.*, c.name as category_name FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ? AND p.id != ? LIMIT 4
  `).all(categoryId, excludeId) as Product[]
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id)
  if (!product) notFound()

  const images: string[] = JSON.parse(product.images || '[]')
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : null
  const related = getRelated(product.category_id, product.id)

  const waMessage = `Bonjour Softride 👋\n\nJe suis intéressé par:\n*${product.name}*\nPrix: ${product.price.toLocaleString()} MAD\n\nMerci!`

  return (
    <>
      <Header />
      <CartSidebar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-primary">Accueil</a>
          <span className="mx-2">›</span>
          <a href="/products" className="hover:text-primary">Produits</a>
          {product.category_name && (
            <>
              <span className="mx-2">›</span>
              <a href={`/products?category=${product.category_slug}`} className="hover:text-primary">{product.category_name}</a>
            </>
          )}
          <span className="mx-2">›</span>
          <span className="text-dark">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <ImageCarousel images={images} productName={product.name} />

          {/* Info */}
          <div>
            {product.badge && (
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${
                product.badge === 'PROMO' ? 'bg-red-500 text-white' :
                product.badge === 'TOP VENTE' ? 'bg-accent text-dark' :
                product.badge === 'NOUVEAU' ? 'bg-blue-500 text-white' :
                'bg-orange-500 text-white'
              }`}>{product.badge}</span>
            )}

            <h1 className="text-2xl font-bold text-dark mb-2">{product.name}</h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-accent">★★★★★</span>
              <span className="text-sm text-gray-500">(5.0)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">{product.price.toLocaleString()} MAD</span>
              {product.old_price && (
                <span className="text-xl text-gray-400 line-through">{product.old_price.toLocaleString()} MAD</span>
              )}
              {discount && (
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-lg">-{discount}%</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 mb-4 arabic leading-relaxed">{product.description}</p>
            )}

            {/* Specs */}
            {(product.speed || product.range) && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.speed && (
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{product.speed}</div>
                    <div className="text-xs text-gray-500">km/h max</div>
                    <div className="text-xs text-gray-400 mt-0.5">⚡ Vitesse</div>
                  </div>
                )}
                {product.range && (
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{product.range}</div>
                    <div className="text-xs text-gray-500">km autonomie</div>
                    <div className="text-xs text-gray-400 mt-0.5">🔋 Batterie</div>
                  </div>
                )}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <AddToCartButton
                id={product.id}
                name={product.name}
                price={product.price}
                image={images[0] || ''}
              />
              <a
                href={`https://wa.me/212770892279?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-3 rounded-xl transition-colors whatsapp-pulse"
              >
                <span className="text-xl">💬</span>
                Commander via WhatsApp
              </a>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t">
              {[
                { icon: '🛡️', text: 'Garantie 2 ans' },
                { icon: '🚚', text: 'Livraison 24h' },
                { icon: '✅', text: 'Qualité certifiée' },
              ].map(g => (
                <div key={g.text} className="text-center">
                  <div className="text-xl">{g.icon}</div>
                  <div className="text-xs text-gray-500 mt-1">{g.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => {
                const imgs: string[] = JSON.parse(p.images || '[]')
                return (
                  <a key={p.id} href={`/products/${p.id}`} className="product-card bg-white rounded-xl overflow-hidden border p-3 block">
                    <div className="relative aspect-square mb-2 bg-gray-50 rounded-lg overflow-hidden">
                      {imgs[0] && <img src={`/images/products/${imgs[0]}`} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                    <p className="text-primary font-bold text-sm">{p.price.toLocaleString()} MAD</p>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

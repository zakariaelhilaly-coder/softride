import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartSidebar from '@/components/CartSidebar'
import ProductCard from '@/components/ProductCard'
import getDb, { Product } from '@/lib/db'

function getFeaturedProducts(): Product[] {
  const db = getDb()
  return db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.featured = 1 ORDER BY p.created_at DESC LIMIT 8
  `).all() as Product[]
}

function getCategories() {
  const db = getDb()
  return db.prepare(`SELECT * FROM categories`).all() as { id: number; name: string; slug: string; icon: string }[]
}

export default function HomePage() {
  const featured = getFeaturedProducts()
  const categories = getCategories()

  return (
    <>
      <Header />
      <CartSidebar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-dark via-[#0d1f3c] to-[#0a1628] text-white">
          <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-primary/20 text-primary border border-primary/30 text-sm px-3 py-1 rounded-full mb-4">
                🇲🇦 Disponible à Rabat • Salé • Kénitra
              </span>
              <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                تنقل ذكي<br />
                <span className="text-primary">بثمن أذكى</span>
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                Trottinettes électriques premium au Maroc. Qualité garantie, prix imbattables.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                  Voir les produits →
                </Link>
                <a href="https://wa.me/212770892279" target="_blank" rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
                  💬 Contactez-nous
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-8">
                {[
                  { value: '500+', label: 'Clients satisfaits' },
                  { value: '2 ans', label: 'Garantie' },
                  { value: '24h', label: 'Livraison' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-xl font-bold text-primary">{s.value}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/banner/hero-image.jpg"
                alt="Trottinette électrique Softride"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* Features bar */}
        <section className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🚚', title: 'Livraison gratuite', sub: 'À partir de 2000 MAD' },
                { icon: '🛡️', title: 'Garantie 2 ans', sub: 'Sur tous les produits' },
                { icon: '💬', title: 'Support WhatsApp', sub: 'Réponse rapide' },
                { icon: '✅', title: 'Qualité certifiée', sub: 'Produits testés' },
              ].map(f => (
                <div key={f.title} className="flex items-center gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-dark">{f.title}</p>
                    <p className="text-xs text-gray-500">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold text-dark mb-6">Nos catégories</h2>
            <div className="grid grid-cols-3 gap-4">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group bg-white rounded-2xl p-6 text-center shadow-sm border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <p className="font-semibold text-dark text-sm">{cat.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featured.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-4 pb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">Produits vedettes</h2>
              <Link href="/products" className="text-primary hover:text-primary-dark font-medium text-sm">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => (
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
          </section>
        )}

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Prêt à rouler électrique ? ⚡</h2>
            <p className="text-white/80 mb-6">Contactez-nous sur WhatsApp pour plus d&apos;informations</p>
            <a
              href="https://wa.me/212770892279"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors whatsapp-pulse"
            >
              💬 Commandez maintenant
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartSidebar from '@/components/CartSidebar'

export default function AboutPage() {
  return (
    <>
      <Header />
      <CartSidebar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-dark to-[#0d1f3c] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">À propos de <span className="text-primary">Softride</span></h1>
            <p className="text-gray-300 text-lg">تنقل ذكي بثمن أذكى</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
            <div>
              <h2 className="text-2xl font-bold text-dark mb-4">Notre histoire</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Softride est votre spécialiste en trottinettes électriques au Maroc. Basés à Rabat, Salé et Kénitra, nous proposons des produits de qualité à des prix accessibles pour tous les Marocains.
              </p>
              <p className="text-gray-600 leading-relaxed">
                نحن متخصصون في بيع الكيكات الكهربائية بالمغرب. نقدم منتجات ذات جودة عالية بأسعار معقولة لجميع المغاربة.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '500+', label: 'Clients satisfaits' },
                  { value: '2 ans', label: 'Garantie' },
                  { value: '3', label: 'Villes couvertes' },
                  { value: '24h', label: 'Livraison' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl font-bold text-primary">{s.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Notre mission', desc: 'Rendre la mobilité électrique accessible à tous au Maroc avec des produits de qualité.' },
              { icon: '🌿', title: 'Éco-responsable', desc: "La trottinette électrique, c'est bon pour la planète et pour votre porte-monnaie." },
              { icon: '🤝', title: 'Service client', desc: 'Disponibles sur WhatsApp pour vous aider avant, pendant et après votre achat.' },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border text-center">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-dark mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

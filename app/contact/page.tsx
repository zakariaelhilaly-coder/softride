import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartSidebar from '@/components/CartSidebar'

export default function ContactPage() {
  return (
    <>
      <Header />
      <CartSidebar />
      <main>
        <section className="bg-gradient-to-br from-dark to-[#0d1f3c] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-gray-300">Nous sommes là pour vous aider</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Info */}
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Nos coordonnées</h2>
              <div className="space-y-4">
                {[
                  { icon: '📍', label: 'Adresse', value: 'Rabat • Salé • Kénitra, Maroc' },
                  { icon: '📞', label: 'Téléphone', value: '+212 7 70 89 22 79', href: 'tel:+212770892279' },
                  { icon: '✉️', label: 'Email', value: 'contact@softride.ma', href: 'mailto:contact@softride.ma' },
                  { icon: '📸', label: 'Instagram', value: '@softride000', href: 'https://instagram.com/softride000' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium text-dark hover:text-primary transition-colors">{item.value}</a>
                      ) : (
                        <p className="font-medium text-dark">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#25D366]/10 rounded-xl border border-[#25D366]/20">
                <p className="font-semibold text-dark mb-2">💬 La façon la plus rapide ?</p>
                <p className="text-sm text-gray-600 mb-3">Écrivez-nous directement sur WhatsApp pour une réponse immédiate.</p>
                <a
                  href="https://wa.me/212770892279"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1da851] transition-colors"
                >
                  💬 Ouvrir WhatsApp
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Zones de livraison</h2>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 h-64 flex items-center justify-center border-2 border-dashed border-primary/30">
                <div className="text-center">
                  <div className="text-5xl mb-3">🗺️</div>
                  <p className="font-bold text-dark">Rabat • Salé • Kénitra</p>
                  <p className="text-sm text-gray-500 mt-2">Livraison disponible dans tout le Maroc</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-dark mb-3">Horaires</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { day: 'Lundi - Vendredi', hours: '9h00 - 18h00' },
                    { day: 'Samedi', hours: '10h00 - 16h00' },
                    { day: 'Dimanche', hours: 'WhatsApp uniquement' },
                  ].map(h => (
                    <div key={h.day} className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">{h.day}</span>
                      <span className="font-medium text-dark">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

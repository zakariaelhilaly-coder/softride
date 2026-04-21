import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="relative w-36 h-10 mb-3">
              <Image src="/images/logo/softride-logo.jpg" alt="Softride" fill className="object-contain brightness-0 invert" />
            </div>
            <p className="text-sm text-gray-400 mb-1">تنقل ذكي بثمن أذكى</p>
            <p className="text-sm text-gray-400">Rabat • Salé • Kénitra, Maroc</p>
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com/softride000" target="_blank" rel="noopener noreferrer"
                className="text-2xl hover:text-accent transition-colors">📸</a>
              <a href="https://wa.me/212770892279" target="_blank" rel="noopener noreferrer"
                className="text-2xl hover:text-green-400 transition-colors">💬</a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/products', label: 'Tous les produits' },
                { href: '/products?category=trottinettes', label: 'Trottinettes' },
                { href: '/products?category=pieces', label: 'Pièces détachées' },
                { href: '/products?category=accessoires', label: 'Accessoires' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Informations</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/about', label: 'À propos' },
                { href: '/contact', label: 'Contact' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Rabat • Salé • Kénitra</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+212770892279" className="hover:text-primary transition-colors">+212 7 70 89 22 79</a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:contact@softride.ma" className="hover:text-primary transition-colors">contact@softride.ma</a>
              </li>
              <li className="flex items-center gap-2">
                <span>📸</span>
                <a href="https://instagram.com/softride000" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@softride000</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Softride. Tous droits réservés. | تنقل ذكي بثمن أذكى</p>
        </div>
      </div>
    </footer>
  )
}

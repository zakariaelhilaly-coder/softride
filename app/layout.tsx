import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'

export const metadata: Metadata = {
  title: 'Softride | Trottinettes électriques au Maroc',
  description: 'Softride - أفضل تروتينات كهربائية بالمغرب. Achetez des trottinettes électriques de qualité à Rabat, Salé et Kénitra. Xiaomi, Dualtron et plus.',
  keywords: 'trottinette maroc, trottinette rabat, xiaomi maroc, dualtron maroc, trottinette électrique maroc, softride',
  openGraph: {
    title: 'Softride | Trottinettes électriques au Maroc',
    description: 'تنقل ذكي بثمن أذكى - Trottinettes électriques à Rabat, Salé, Kénitra',
    locale: 'fr_MA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}

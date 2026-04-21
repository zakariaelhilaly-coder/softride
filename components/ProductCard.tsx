'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  id: number
  name: string
  price: number
  oldPrice?: number | null
  images: string[]
  badge?: string | null
  speed?: number | null
  range?: number | null
  description?: string | null
}

function badgeStyle(badge: string) {
  switch (badge) {
    case 'PROMO': return 'bg-red-500 text-white'
    case 'NOUVEAU': return 'bg-blue-500 text-white'
    case 'TOP VENTE': return 'bg-accent text-dark'
    case 'STOCK LIMITÉ': return 'bg-orange-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

export default function ProductCard({ id, name, price, oldPrice, images, badge, speed, range }: ProductCardProps) {
  const { addItem } = useCart()
  const image = images[0] || ''
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : null

  return (
    <div className="product-card bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
      {/* Image */}
      <Link href={`/products/${id}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        {image && (
          <Image
            src={`/images/products/${image}`}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        )}
        {badge && (
          <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${badgeStyle(badge)}`}>
            {badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-dark text-sm mb-1 hover:text-primary transition-colors line-clamp-2">{name}</h3>
        </Link>

        {/* Stars */}
        <div className="flex text-accent text-xs mb-2">
          {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
        </div>

        {/* Specs */}
        {(speed || range) && (
          <div className="flex gap-2 mb-2">
            {speed && <span className="text-xs bg-green-50 text-primary px-2 py-0.5 rounded-full">⚡ {speed} km/h</span>}
            {range && <span className="text-xs bg-green-50 text-primary px-2 py-0.5 rounded-full">🔋 {range} km</span>}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-bold text-primary">{price.toLocaleString()} MAD</span>
            {oldPrice && (
              <span className="text-sm text-gray-400 line-through">{oldPrice.toLocaleString()} MAD</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => addItem({ id, name, price, image: `/images/products/${image}` })}
              className="flex-1 bg-primary text-white text-xs py-2 px-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Ajouter au panier
            </button>
            <a
              href={`https://wa.me/212770892279?text=Bonjour, je suis intéressé par ${encodeURIComponent(name)} - ${price} MAD`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-3 py-2 rounded-lg text-xs hover:bg-[#1da851] transition-colors flex items-center"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

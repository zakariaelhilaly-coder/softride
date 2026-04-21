'use client'

import { useCart } from '@/contexts/CartContext'

interface Props {
  id: number
  name: string
  price: number
  image: string
}

export default function AddToCartButton({ id, name, price, image }: Props) {
  const { addItem } = useCart()

  return (
    <button
      onClick={() => addItem({ id, name, price, image: `/images/products/${image}` })}
      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
    >
      🛒 Ajouter au panier
    </button>
  )
}

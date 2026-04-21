'use client'

import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { useEffect } from 'react'

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, clearCart, total, count, isOpen, setIsOpen } = useCart()

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setIsOpen])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const buildWhatsAppMessage = () => {
    const lines = items.map(i => `• ${i.name} x${i.quantity} = ${(i.price * i.quantity).toLocaleString()} MAD`)
    const msg = `Bonjour Softride 👋\n\nJe voudrais commander:\n${lines.join('\n')}\n\n*Total: ${total.toLocaleString()} MAD*\n\nMerci!`
    return `https://wa.me/212770892279?text=${encodeURIComponent(msg)}`
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-dark text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="font-semibold">Mon Panier</h2>
            {count > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">{count}</span>}
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white text-xl">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-medium">Votre panier est vide</p>
              <p className="text-sm mt-1">Ajoutez des produits pour continuer</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark line-clamp-1">{item.name}</p>
                  <p className="text-primary font-bold text-sm">{item.price.toLocaleString()} MAD</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-white border rounded text-sm hover:border-primary">−</button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-white border rounded text-sm hover:border-primary">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-dark">Total</span>
              <span className="text-xl font-bold text-primary">{total.toLocaleString()} MAD</span>
            </div>
            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-xl hover:bg-[#1da851] transition-colors whatsapp-pulse"
            >
              <span className="text-xl">💬</span>
              Commander via WhatsApp
            </a>
            <button
              onClick={clearCart}
              className="w-full mt-2 text-sm text-gray-400 hover:text-red-500 transition-colors py-1"
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  )
}

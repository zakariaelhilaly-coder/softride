'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import TopBar from './TopBar'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, setIsOpen } = useCart()
  const router = useRouter()
  const prevCount = useRef(count)
  const [cartBounce, setCartBounce] = useState(false)

  useEffect(() => {
    if (count > prevCount.current) {
      setCartBounce(true)
      setTimeout(() => setCartBounce(false), 300)
    }
    prevCount.current = count
  }, [count])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/products', label: 'Produits' },
    { href: '/products?category=trottinettes', label: 'Trottinettes' },
    { href: '/products?category=pieces', label: 'Pièces' },
    { href: '/products?category=accessoires', label: 'Accessoires' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-36 h-10">
              <Image
                src="/images/logo/softride-logo.jpg"
                alt="Softride"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="flex w-full rounded-lg overflow-hidden border-2 border-primary">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher une trottinette..."
                className="flex-1 px-4 py-2 outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-primary px-4 py-2 text-white hover:bg-primary-dark transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Cart + Menu */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <span className={cartBounce ? 'cart-bounce' : ''}>🛒</span>
              <span className="text-sm font-semibold hidden sm:block">Panier</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-dark text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 pb-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-green-50 rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <form onSubmit={handleSearch} className="px-4 py-3">
            <div className="flex rounded-lg overflow-hidden border-2 border-primary">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="flex-1 px-3 py-2 outline-none text-sm"
              />
              <button type="submit" className="bg-primary px-3 py-2 text-white">🔍</button>
            </div>
          </form>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-green-50 border-b"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

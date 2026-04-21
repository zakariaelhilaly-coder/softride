'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[]
  productName: string
}

export default function ImageCarousel({ images, productName }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)

  if (!images.length) return (
    <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-4xl">🛴</div>
  )

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
        <Image
          src={`/images/products/${images[current]}`}
          alt={`${productName} - ${current + 1}`}
          fill
          className="object-cover"
          priority
        />
        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent(i => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md text-dark transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrent(i => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md text-dark transition-colors"
            >
              ›
            </button>
          </>
        )}
        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-white/60'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                i === current ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image src={`/images/products/${img}`} alt={`Miniature ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

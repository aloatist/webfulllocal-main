'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface WishlistButtonProps {
  itemId: string
  itemType: 'tour' | 'homestay'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WishlistButton({ itemId, itemType, className, size = 'md' }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  }

  // Load wishlist state from localStorage
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const key = `${itemType}-${itemId}`
    setIsInWishlist(wishlist.includes(key))
  }, [itemId, itemType])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const key = `${itemType}-${itemId}`

    let newWishlist: string[]
    if (wishlist.includes(key)) {
      newWishlist = wishlist.filter((item: string) => item !== key)
      setIsInWishlist(false)
    } else {
      newWishlist = [...wishlist, key]
      setIsInWishlist(true)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    }

    localStorage.setItem('wishlist', JSON.stringify(newWishlist))

    // Dispatch custom event for wishlist updates
    window.dispatchEvent(new CustomEvent('wishlistUpdate', { detail: { wishlist: newWishlist } }))
  }

  return (
    <motion.button
      type="button"
      onClick={toggleWishlist}
      className={cn(
        'rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
        'hover:bg-white dark:hover:bg-gray-800',
        'transition-all duration-300',
        'hover:shadow-lg hover:scale-110',
        'active:scale-95',
        buttonSizeClasses[size],
        className
      )}
      whileTap={{ scale: 0.9 }}
      aria-label={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.6 }}
      >
        <Heart
          className={cn(
            sizeClasses[size],
            'transition-colors duration-300',
            isInWishlist
              ? 'fill-red-500 text-red-500'
              : 'fill-none text-gray-600 dark:text-gray-400'
          )}
        />
      </motion.div>
    </motion.button>
  )
}

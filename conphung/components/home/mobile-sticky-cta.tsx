'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero (> 400px)
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className={`
        fixed bottom-20 md:bottom-4 left-0 right-0 z-40 px-4
        transition-all duration-300
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
        md:hidden
      `}
    >
      <div className="container mx-auto max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-emerald-500/20 p-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {/* Primary CTA - Call */}
            <Button 
              size="lg"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold shadow-lg shadow-emerald-500/30"
              asChild
            >
              <Link href="tel:+84918267715">
                <Phone className="w-5 h-5 mr-2" />
                Gọi Ngay
              </Link>
            </Button>

            {/* Secondary CTA - Chat */}
            <Button 
              size="lg"
              variant="outline"
              className="flex-1 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-semibold"
              asChild
            >
              <Link href="https://zalo.me/0918267715" target="_blank">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat Zalo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}



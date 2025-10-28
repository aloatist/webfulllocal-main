'use client'

import { useState } from 'react'
import { MessageCircle, X, Facebook, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatOption {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  onClick: () => void
}

interface ChatWidgetProps {
  options: ChatOption[]
  position?: 'bottom-right' | 'bottom-left'
  className?: string
}

export function ChatWidget({
  options,
  position = 'bottom-right',
  className,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={cn(
        'fixed z-[60]',
        position === 'bottom-right' 
          ? 'bottom-20 right-4 md:bottom-4' 
          : 'bottom-20 left-4 md:bottom-4',
        className
      )}
    >
      {/* Options Menu */}
      {isOpen && (
        <div className="mb-4 space-y-2 animate-in slide-in-from-bottom">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                option.onClick()
                setIsOpen(false)
              }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-full shadow-lg',
                'text-white font-medium',
                'hover:scale-105 transition-transform',
                'touch-manipulation'
              )}
              style={{ backgroundColor: option.color }}
            >
              {option.icon}
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full shadow-lg',
          'bg-primary text-primary-foreground',
          'flex items-center justify-center',
          'hover:scale-110 transition-transform',
          'touch-manipulation'
        )}
        aria-label={isOpen ? 'Đóng chat' : 'Mở chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  )
}

// Pre-configured chat widget with common options
interface QuickChatWidgetProps {
  phoneNumber?: string
  facebookPageId?: string
  zaloOaId?: string
  tawkPropertyId?: string
  tawkWidgetId?: string
}

export function QuickChatWidget({
  phoneNumber,
  facebookPageId,
  zaloOaId,
  tawkPropertyId,
  tawkWidgetId,
}: QuickChatWidgetProps) {
  const options: ChatOption[] = []

  // Phone call option
  if (phoneNumber) {
    options.push({
      id: 'phone',
      name: 'Gọi điện',
      icon: <Phone className="w-5 h-5" />,
      color: '#10b981',
      onClick: () => {
        window.location.href = `tel:${phoneNumber}`
      },
    })
  }

  // Facebook Messenger
  if (facebookPageId) {
    options.push({
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: '#1877f2',
      onClick: () => {
        window.open(`https://m.me/${facebookPageId}`, '_blank')
      },
    })
  }

  // Zalo
  if (zaloOaId) {
    options.push({
      id: 'zalo',
      name: 'Zalo',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 4C12.96 4 4 12.96 4 24C4 29.52 6.48 34.44 10.44 37.8L9.6 43.2L15.24 41.04C17.76 42.24 20.76 43.2 24 43.2C35.04 43.2 44 34.24 44 23.2C44 12.16 35.04 4 24 4Z" />
        </svg>
      ),
      color: '#0068ff',
      onClick: () => {
        window.open(`https://zalo.me/${zaloOaId}`, '_blank')
      },
    })
  }

  // Tawk.to
  if (tawkPropertyId && tawkWidgetId) {
    options.push({
      id: 'tawkto',
      name: 'Live Chat',
      icon: <MessageCircle className="w-5 h-5" />,
      color: '#4caf50',
      onClick: () => {
        if (typeof window !== 'undefined' && (window as any).Tawk_API) {
          ;(window as any).Tawk_API.maximize()
        }
      },
    })
  }

  if (options.length === 0) {
    return null
  }

  return <ChatWidget options={options} />
}

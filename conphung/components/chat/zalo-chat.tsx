'use client'

import { useEffect } from 'react'

interface ZaloChatProps {
  oaId: string
  welcomeMessage?: string
  autoExpand?: boolean
  width?: number
  height?: number
}

export function ZaloChat({
  oaId,
  welcomeMessage = 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
  autoExpand = false,
  width = 350,
  height = 420,
}: ZaloChatProps) {
  useEffect(() => {
    // Load Zalo SDK
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://sp.zalo.me/plugins/sdk.js'
      script.async = true
      
      document.body.appendChild(script)

      return () => {
        // Cleanup
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    }
  }, [])

  return (
    <div
      className="zalo-chat-widget"
      data-oaid={oaId}
      data-welcome-message={welcomeMessage}
      data-autopopup={autoExpand ? '1' : '0'}
      data-width={width}
      data-height={height}
    ></div>
  )
}

// Alternative: Zalo Button
interface ZaloButtonProps {
  phoneNumber: string
  message?: string
  className?: string
}

export function ZaloButton({
  phoneNumber,
  message = 'Xin chào',
  className = '',
}: ZaloButtonProps) {
  const handleClick = () => {
    const zaloUrl = `https://zalo.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(zaloUrl, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label="Chat qua Zalo"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
      >
        <path
          d="M24 4C12.96 4 4 12.96 4 24C4 29.52 6.48 34.44 10.44 37.8L9.6 43.2L15.24 41.04C17.76 42.24 20.76 43.2 24 43.2C35.04 43.2 44 34.24 44 23.2C44 12.16 35.04 4 24 4Z"
          fill="#0068FF"
        />
        <path
          d="M24 8C14.08 8 6 16.08 6 26C6 30.8 8.08 35.12 11.44 38.16L10.8 42.4L15.28 40.64C17.52 41.68 20.16 42.4 24 42.4C33.92 42.4 42 34.32 42 24.4C42 14.48 33.92 8 24 8Z"
          fill="white"
        />
        <path
          d="M17.6 28.8L22.4 24L27.2 28.8L32.8 20.8L28 24.8L23.2 20L17.6 28.8Z"
          fill="#0068FF"
        />
      </svg>
      <span className="ml-2">Chat Zalo</span>
    </button>
  )
}

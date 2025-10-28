'use client'

import { useEffect } from 'react'

interface TawkToProps {
  propertyId: string
  widgetId: string
}

export function TawkTo({ propertyId, widgetId }: TawkToProps) {
  useEffect(() => {
    // Check if Tawk_API already exists
    if (typeof window !== 'undefined' && !(window as any).Tawk_API) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`
      script.charset = 'UTF-8'
      script.setAttribute('crossorigin', '*')
      
      const firstScript = document.getElementsByTagName('script')[0]
      firstScript.parentNode?.insertBefore(script, firstScript)
    }
  }, [propertyId, widgetId])

  return null
}

// Hook to control Tawk.to programmatically
export function useTawkTo() {
  const maximize = () => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.maximize()
    }
  }

  const minimize = () => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.minimize()
    }
  }

  const toggle = () => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.toggle()
    }
  }

  const setAttributes = (attributes: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.setAttributes(attributes)
    }
  }

  const addEvent = (event: string, metadata?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.addEvent(event, metadata)
    }
  }

  return {
    maximize,
    minimize,
    toggle,
    setAttributes,
    addEvent,
  }
}

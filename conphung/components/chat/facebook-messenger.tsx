'use client'

import { useEffect } from 'react'

interface FacebookMessengerProps {
  pageId: string
  appId: string
  locale?: string
  themeColor?: string
  loggedInGreeting?: string
  loggedOutGreeting?: string
}

export function FacebookMessenger({
  pageId,
  appId,
  locale = 'vi_VN',
  themeColor = '#10b981',
  loggedInGreeting = 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
  loggedOutGreeting = 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
}: FacebookMessengerProps) {
  useEffect(() => {
    // Load Facebook SDK
    if (typeof window !== 'undefined' && !(window as any).FB) {
      // Set Facebook app ID
      ;(window as any).fbAsyncInit = function () {
        ;(window as any).FB.init({
          xfbml: true,
          version: 'v18.0',
        })
      }

      // Load SDK
      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      script.src = `https://connect.facebook.net/${locale}/sdk/xfbml.customerchat.js`
      
      const firstScript = document.getElementsByTagName('script')[0]
      firstScript.parentNode?.insertBefore(script, firstScript)
    }
  }, [locale])

  return (
    <>
      <div id="fb-root"></div>
      <div
        className="fb-customerchat"
        data-attribution="biz_inbox"
        data-page-id={pageId}
        data-theme-color={themeColor}
        data-logged-in-greeting={loggedInGreeting}
        data-logged-out-greeting={loggedOutGreeting}
      ></div>
    </>
  )
}

// Hook to control Facebook Messenger
export function useFacebookMessenger() {
  const show = () => {
    if (typeof window !== 'undefined' && (window as any).FB) {
      ;(window as any).FB.CustomerChat.show()
    }
  }

  const hide = () => {
    if (typeof window !== 'undefined' && (window as any).FB) {
      ;(window as any).FB.CustomerChat.hide()
    }
  }

  const showDialog = () => {
    if (typeof window !== 'undefined' && (window as any).FB) {
      ;(window as any).FB.CustomerChat.showDialog()
    }
  }

  const hideDialog = () => {
    if (typeof window !== 'undefined' && (window as any).FB) {
      ;(window as any).FB.CustomerChat.hideDialog()
    }
  }

  return {
    show,
    hide,
    showDialog,
    hideDialog,
  }
}

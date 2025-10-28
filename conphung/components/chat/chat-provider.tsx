'use client'

import { TawkTo } from './tawk-to'
import { FacebookMessenger } from './facebook-messenger'
import { ZaloChat } from './zalo-chat'
import { QuickChatWidget } from './chat-widget'
import type { ChatSettings } from '@/lib/chat/types'

interface ChatProviderProps {
  settings: ChatSettings
}

export function ChatProvider({ settings }: ChatProviderProps) {
  if (!settings.enabled) {
    return null
  }

  const { providers, contactInfo, appearance } = settings

  return (
    <>
      {/* Tawk.to */}
      {providers.tawkTo?.enabled && providers.tawkTo.propertyId && providers.tawkTo.widgetId && (
        <TawkTo
          propertyId={providers.tawkTo.propertyId}
          widgetId={providers.tawkTo.widgetId}
        />
      )}

      {/* Facebook Messenger */}
      {providers.facebook?.enabled && providers.facebook.pageId && providers.facebook.appId && (
        <FacebookMessenger
          pageId={providers.facebook.pageId}
          appId={providers.facebook.appId}
          themeColor={appearance.primaryColor}
          loggedInGreeting={appearance.welcomeMessage}
          loggedOutGreeting={appearance.welcomeMessage}
        />
      )}

      {/* Zalo Chat */}
      {providers.zalo?.enabled && providers.zalo.oaId && (
        <ZaloChat
          oaId={providers.zalo.oaId}
          welcomeMessage={appearance.welcomeMessage}
        />
      )}

      {/* Quick Chat Widget - Only show if no other widgets are enabled */}
      {!providers.tawkTo?.enabled && !providers.facebook?.enabled && !providers.zalo?.enabled && (
        <QuickChatWidget
          phoneNumber={contactInfo.phoneNumber || providers.zalo?.phoneNumber}
          facebookPageId={providers.facebook?.pageId}
          zaloOaId={providers.zalo?.oaId}
        />
      )}
    </>
  )
}

// Default chat provider with hardcoded settings (for quick setup)
export function DefaultChatProvider() {
  const settings: ChatSettings = {
    enabled: true,
    providers: {
      // Add your credentials here
      tawkTo: {
        enabled: false,
        propertyId: process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || '',
        widgetId: process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || '',
      },
      facebook: {
        enabled: false,
        pageId: process.env.NEXT_PUBLIC_FB_PAGE_ID || '',
        appId: process.env.NEXT_PUBLIC_FB_APP_ID || '',
      },
      zalo: {
        enabled: false,
        oaId: process.env.NEXT_PUBLIC_ZALO_OA_ID || '',
        phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '',
      },
    },
    contactInfo: {
      phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '0123456789',
      email: process.env.NEXT_PUBLIC_EMAIL || 'info@conphungtourist.com',
      workingHours: '8:00 - 17:00 (Thứ 2 - Chủ nhật)',
    },
    appearance: {
      position: 'bottom-right',
      primaryColor: '#10b981',
      welcomeMessage: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
    },
  }

  return <ChatProvider settings={settings} />
}

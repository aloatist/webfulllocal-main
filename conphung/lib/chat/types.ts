export interface ChatSettings {
  enabled: boolean
  providers: {
    tawkTo?: {
      enabled: boolean
      propertyId: string
      widgetId: string
    }
    facebook?: {
      enabled: boolean
      pageId: string
      appId: string
    }
    zalo?: {
      enabled: boolean
      oaId: string
      phoneNumber?: string
    }
  }
  contactInfo: {
    phoneNumber?: string
    email?: string
    workingHours?: string
  }
  appearance: {
    position: 'bottom-right' | 'bottom-left'
    primaryColor?: string
    welcomeMessage?: string
  }
}

export const defaultChatSettings: ChatSettings = {
  enabled: true,
  providers: {},
  contactInfo: {},
  appearance: {
    position: 'bottom-right',
    primaryColor: '#10b981',
    welcomeMessage: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
  },
}

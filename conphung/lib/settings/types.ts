export type SettingType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'IMAGE' | 'EMAIL' | 'URL'

export type SettingCategory = 
  | 'general'
  | 'contact'
  | 'social'
  | 'seo'
  | 'booking'
  | 'payment'
  | 'chat'
  | 'email'
  | 'appearance'

export interface Setting {
  id: string
  key: string
  value: string
  type: SettingType
  category: SettingCategory
  label: string
  description?: string
  placeholder?: string
  options?: string[] // For select/radio inputs
  required?: boolean
  order?: number
  createdAt: Date
  updatedAt: Date
}

export interface SettingInput {
  key: string
  value: string
  type: SettingType
  category: SettingCategory
  label: string
  description?: string
  placeholder?: string
  options?: string[]
  required?: boolean
  order?: number
}

export const defaultSettings: SettingInput[] = [
  // General
  {
    key: 'site_name',
    value: 'Khu Du Lịch Cồn Phụng',
    type: 'TEXT',
    category: 'general',
    label: 'Tên website',
    description: 'Tên hiển thị của website',
    required: true,
    order: 1,
  },
  {
    key: 'site_description',
    value: 'Khu vui chơi và du lịch Cồn Phụng Bến Tre',
    type: 'TEXT',
    category: 'general',
    label: 'Mô tả website',
    description: 'Mô tả ngắn về website',
    order: 2,
  },
  {
    key: 'site_logo',
    value: '/logo.png',
    type: 'IMAGE',
    category: 'general',
    label: 'Logo',
    description: 'Logo của website',
    order: 3,
  },
  
  // Contact
  {
    key: 'contact_hotline',
    value: '0918267715',
    type: 'TEXT',
    category: 'contact',
    label: 'Hotline',
    required: true,
    order: 1,
  },
  {
    key: 'contact_email',
    value: 'conphungtourist87@gmail.com',
    type: 'EMAIL',
    category: 'contact',
    label: 'Email',
    required: true,
    order: 2,
  },
  {
    key: 'contact_address',
    value: 'Tờ bản đồ số 3, thửa đất số 32, ấp 10 (ấp Tân Vinh), xã Phú Túc, tỉnh Vĩnh Long',
    type: 'TEXT',
    category: 'contact',
    label: 'Địa chỉ',
    order: 3,
  },
  
  // Social
  {
    key: 'social_facebook',
    value: 'https://www.facebook.com/dulichconphungbentre',
    type: 'URL',
    category: 'social',
    label: 'Facebook URL',
    order: 1,
  },
  {
    key: 'social_instagram',
    value: 'https://www.instagram.com/dulichconphungbentre',
    type: 'URL',
    category: 'social',
    label: 'Instagram URL',
    order: 2,
  },
  {
    key: 'social_youtube',
    value: 'https://www.youtube.com/@ConPhungTouristBenTre',
    type: 'URL',
    category: 'social',
    label: 'YouTube URL',
    order: 3,
  },
  {
    key: 'social_zalo',
    value: 'https://zalo.me/0918267715',
    type: 'URL',
    category: 'social',
    label: 'Zalo URL',
    order: 4,
  },
  
  // SEO
  {
    key: 'seo_title',
    value: 'Khu Du Lịch Cồn Phụng | Bến Tre',
    type: 'TEXT',
    category: 'seo',
    label: 'SEO Title',
    order: 1,
  },
  {
    key: 'seo_description',
    value: 'Khám phá Khu Du Lịch Cồn Phụng với công trình kiến trúc Đạo Dừa độc đáo',
    type: 'TEXT',
    category: 'seo',
    label: 'SEO Description',
    order: 2,
  },
  {
    key: 'seo_keywords',
    value: 'cồn phụng, bến tre, du lịch, đạo dừa',
    type: 'TEXT',
    category: 'seo',
    label: 'SEO Keywords',
    order: 3,
  },
  
  // Booking
  {
    key: 'booking_min_nights',
    value: '1',
    type: 'NUMBER',
    category: 'booking',
    label: 'Số đêm tối thiểu',
    order: 1,
  },
  {
    key: 'booking_max_guests',
    value: '10',
    type: 'NUMBER',
    category: 'booking',
    label: 'Số khách tối đa',
    order: 2,
  },
  {
    key: 'booking_advance_days',
    value: '1',
    type: 'NUMBER',
    category: 'booking',
    label: 'Số ngày đặt trước tối thiểu',
    order: 3,
  },
  
  // Chat
  {
    key: 'chat_tawk_property_id',
    value: '',
    type: 'TEXT',
    category: 'chat',
    label: 'Tawk.to Property ID',
    order: 1,
  },
  {
    key: 'chat_tawk_widget_id',
    value: '',
    type: 'TEXT',
    category: 'chat',
    label: 'Tawk.to Widget ID',
    order: 2,
  },
  {
    key: 'chat_facebook_page_id',
    value: '',
    type: 'TEXT',
    category: 'chat',
    label: 'Facebook Page ID',
    order: 3,
  },
]

export const categoryLabels: Record<SettingCategory, string> = {
  general: 'Cài đặt chung',
  contact: 'Thông tin liên hệ',
  social: 'Mạng xã hội',
  seo: 'SEO',
  booking: 'Đặt phòng',
  payment: 'Thanh toán',
  chat: 'Chat',
  email: 'Email',
  appearance: 'Giao diện',
}

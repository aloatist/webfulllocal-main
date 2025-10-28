import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Khu Du Lịch Cồn Phụng',
    short_name: 'Cồn Phụng',
    description: 'Khu du lịch sinh thái Cồn Phụng - Điểm đến lý tưởng tại Bến Tre',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10b981',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['travel', 'tourism', 'lifestyle'],
    shortcuts: [
      {
        name: 'Tours',
        short_name: 'Tours',
        description: 'Xem các tour du lịch',
        url: '/tours',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Homestays',
        short_name: 'Homestays',
        description: 'Đặt phòng homestay',
        url: '/homestays',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Tin tức',
        short_name: 'News',
        description: 'Đọc tin tức mới nhất',
        url: '/news',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
    // Screenshots removed due to TypeScript limitation
    // Will be added when Next.js updates manifest types
  }
}

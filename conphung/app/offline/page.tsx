'use client'

import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          Bạn đang offline
        </h1>
        
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Không có kết nối internet. Vui lòng kiểm tra kết nối của bạn và thử lại.
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Thử lại
        </button>
        
        <div className="mt-12 text-sm text-muted-foreground">
          <p>Một số trang đã được lưu để xem offline:</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="/" className="text-primary hover:underline">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="/tours" className="text-primary hover:underline">
                Tours
              </a>
            </li>
            <li>
              <a href="/homestays" className="text-primary hover:underline">
                Homestays
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

import { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { ContactInfo } from '@/components/contact/contact-info'
import { MapEmbed } from '@/components/contact/map-embed'
import { FadeIn } from '@/components/ui/fade-in'
import { Mail, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Liên hệ | Khu Du Lịch Cồn Phụng',
  description: 'Liên hệ với Khu Du Lịch Cồn Phụng để được tư vấn và đặt tour. Hotline: 0918 267 715',
  openGraph: {
    title: 'Liên hệ | Khu Du Lịch Cồn Phụng',
    description: 'Liên hệ với chúng tôi để được tư vấn và đặt tour',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <FadeIn direction="down">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin, 
              chúng tôi sẽ liên hệ lại sớm nhất có thể.
            </p>
          </div>
        </FadeIn>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Gửi tin nhắn</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <ContactForm />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Thông tin liên hệ</h2>
            </div>
            <ContactInfo />
          </div>
        </div>

        {/* Map */}
        <div>
          <FadeIn delay={0.2}>
            <h2 className="text-2xl font-semibold mb-6 text-center">Vị trí của chúng tôi</h2>
          </FadeIn>
          <MapEmbed />
        </div>

        {/* CTA Section */}
        <FadeIn delay={0.4}>
          <div className="mt-12 p-8 bg-gradient-to-r from-primary to-emerald-600 rounded-xl shadow-xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Cần tư vấn ngay?</h3>
            <p className="text-lg mb-6 opacity-90">
              Gọi ngay hotline để được hỗ trợ trực tiếp
            </p>
            <a
              href="tel:+84918267715"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0918 267 715
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

'use client'

import { Shield, CreditCard, RefreshCcw, FileText } from 'lucide-react'
import Link from 'next/link'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'

const policies = [
  {
    title: 'Chính Sách Bảo Mật',
    href: '/chinh-sach-bao-mat',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Phương Thức Thanh Toán',
    href: '/phuong-thuc-thanh-toan',
    icon: CreditCard,
    color: 'from-emerald-500 to-green-500',
  },
  {
    title: 'Chính Sách Hủy – Hoàn Tiền',
    href: '/chinh-sach-huy-hoan-tien',
    icon: RefreshCcw,
    color: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Quy Định Chung',
    href: '/chinh-sach-quy-dinh-chung',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
  },
]

export function PolicyLinksSectionCompact() {
  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        
        <FadeIn>
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Chính Sách & Điều Khoản
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Minh bạch, rõ ràng, bảo vệ quyền lợi khách hàng
            </p>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {policies.map((policy, index) => (
            <StaggerItem key={index}>
              <Link
                href={policy.href}
                className="group flex flex-col items-center justify-center text-center p-4 md:p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${policy.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <policy.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {policy.title}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom Assurance */}
        <FadeIn delay={0.3}>
          <div className="mt-8 text-center">
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              📄 Tất cả chính sách tuân thủ theo quy định của pháp luật Việt Nam
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}



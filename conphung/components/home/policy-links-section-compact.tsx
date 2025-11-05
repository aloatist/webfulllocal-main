'use client'

import { Shield, CreditCard, RefreshCcw, FileText } from 'lucide-react'
import Link from 'next/link'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import type { PolicyLinksSection as PolicyLinksData } from '@/lib/homepage/schema'

interface PolicyLinksSectionCompactProps {
  data?: PolicyLinksData;
}

const defaultPolicies = [
  {
    title: 'CHÍNH SÁCH BẢO MẬT',
    href: '/chinh-sach-bao-mat',
    icon: 'icon-user',
  },
  {
    title: 'PHƯƠNG THỨC THANH TOÁN',
    href: '/phuong-thuc-thanh-toan',
    icon: 'icon-shopping-cart',
  },
  {
    title: 'CHÍNH SÁCH HỦY – HOÀN TIỀN',
    href: '/chinh-sach-huy-hoan-tien',
    icon: 'icon-checkmark',
  },
  {
    title: 'CHÍNH SÁCH – QUY ĐỊNH CHUNG',
    href: '/chinh-sach-quy-dinh-chung',
    icon: 'icon-checkmark',
  },
]

const iconMap: Record<string, typeof Shield> = {
  'icon-user': Shield,
  'icon-shopping-cart': CreditCard,
  'icon-checkmark': RefreshCcw,
  'icon-file': FileText,
}

const colorMap: Record<number, string> = {
  0: 'from-blue-500 to-cyan-500',
  1: 'from-emerald-500 to-green-500',
  2: 'from-amber-500 to-orange-500',
  3: 'from-purple-500 to-pink-500',
}

export function PolicyLinksSectionCompact({ data }: PolicyLinksSectionCompactProps) {
  const policies = data?.links || defaultPolicies;
  const title = data?.title || 'Chính Sách & Điều Khoản';
  const subtitle = data?.subtitle || 'Minh bạch, rõ ràng, bảo vệ quyền lợi khách hàng';
  const bottomText = data?.bottomText || '📄 Tất cả chính sách tuân thủ theo quy định của pháp luật Việt Nam';
  
  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        
        <FadeIn>
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {policies.map((policy, index) => {
            const IconComponent = iconMap[policy.icon || 'icon-user'] || Shield;
            const color = colorMap[index] || colorMap[0];
            return (
              <StaggerItem key={index}>
                <Link
                  href={policy.href}
                  className="group flex flex-col items-center justify-center text-center p-4 md:p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {policy.title}
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Bottom Assurance */}
        {bottomText && (
          <FadeIn delay={0.3}>
            <div className="mt-8 text-center">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {bottomText}
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}



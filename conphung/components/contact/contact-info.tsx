'use client'

import { Phone, Mail, MapPin, Clock, Facebook, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'

const hotlineHighlightClass =
  'inline-flex items-center justify-center rounded-full border border-emerald-300/60 bg-emerald-500/20 px-4 py-1 text-base font-bold text-emerald-800 dark:text-emerald-100 shadow-lg transition-all duration-300 hover:bg-emerald-500/30 hover:text-emerald-900 hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:scale-105'

const contactInfo = [
  {
    icon: Phone,
    title: 'Hotline',
    items: [
      { label: 'Tổng đài', value: '0918 267 715', href: 'tel:+84918267715' },
      { label: 'Ms Cương', value: '0917 645 039', href: 'tel:+84917645039' },
      { label: 'Ms Nhiên', value: '0948 416 066', href: 'tel:+84948416066' },
    ],
  },
  {
    icon: Mail,
    title: 'Email',
    items: [
      { label: 'Email', value: 'conphungtourist87@gmail.com', href: 'mailto:conphungtourist87@gmail.com' },
    ],
  },
  {
    icon: MapPin,
    title: 'Địa chỉ',
    items: [
      { 
        label: 'Địa chỉ', 
        value: 'Ấp Cồn Phụng, Xã An Thạnh, Huyện Chợ Lách, Tỉnh Bến Tre',
        href: 'https://maps.google.com/?q=10.3367211,106.3687357',
      },
    ],
  },
  {
    icon: Clock,
    title: 'Giờ làm việc',
    items: [
      { label: 'Thứ 2 - Chủ nhật', value: '7:00 - 18:00' },
      { label: 'Lễ, Tết', value: '7:00 - 19:00' },
    ],
  },
]

const socialLinks = [
  {
    icon: Facebook,
    name: 'Facebook',
    href: 'https://facebook.com/conphung',
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    icon: MessageCircle,
    name: 'Zalo',
    href: 'https://zalo.me/0918267715',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
]

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <StaggerContainer staggerDelay={0.1}>
        {contactInfo.map((section, index) => (
          <StaggerItem key={index}>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div key={idx}>
                    {'href' in item && item.href ? (
                      <Link
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className={
                          section.title === 'Hotline' && item.value === '0918 267 715'
                            ? hotlineHighlightClass
                            : 'text-primary hover:underline font-medium'
                        }
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{item.label}:</span> {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Social Links */}
      <FadeIn delay={0.4}>
        <div className="p-6 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-lg border border-primary/20">
          <h3 className="text-lg font-semibold mb-4">Kết nối với chúng tôi</h3>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${social.color}`}
              >
                <social.icon className="w-5 h-5" />
                <span className="font-medium">{social.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

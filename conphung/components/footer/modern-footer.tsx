'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Mail, Phone, MapPin, Clock, Send, Instagram, Youtube, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import { useState } from 'react'
import Logo from '@/public/logo.webp'
import { teamMembers } from '@/components/teamMembers'

const footerLinks = {
  company: [
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Liên hệ', href: '/lien-he' },
    { label: 'Tuyển dụng', href: '/tuyen-dung' },
    { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
  ],
  services: [
    { label: 'Tour du lịch', href: '/tours' },
    { label: 'Homestay', href: '/homestays' },
    { label: 'Nhà hàng', href: '/nha-hang' },
    { label: 'Sự kiện', href: '/su-kien' },
  ],
  support: [
    { label: 'Hướng dẫn đặt tour', href: '/huong-dan' },
    { label: 'Câu hỏi thường gặp', href: '/faq' },
    { label: 'Chính sách hoàn tiền', href: '/chinh-sach-hoan-tien' },
    { label: 'Điều khoản sử dụng', href: '/dieu-khoan' },
  ],
}

const socialLinks = [
  {
    icon: Facebook,
    href: 'https://facebook.com/conphung',
    label: 'Facebook',
    color: 'hover:bg-blue-600',
  },
  {
    icon: Instagram,
    href: 'https://instagram.com/conphung',
    label: 'Instagram',
    color: 'hover:bg-pink-600',
  },
  {
    icon: Youtube,
    href: 'https://youtube.com/@conphung',
    label: 'Youtube',
    color: 'hover:bg-red-600',
  },
  {
    icon: MessageCircle,
    href: 'https://zalo.me/0918267715',
    label: 'Zalo',
    color: 'hover:bg-blue-500',
  },
]

const contactInfo = [
  {
    icon: Phone,
    label: 'Hotline',
    value: '0918 267 715',
    href: 'tel:+84918267715',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'conphung87@yahoo.com.vn',
    href: 'mailto:conphung87@yahoo.com.vn',
  },
  {
    icon: MapPin,
    label: 'Địa chỉ',
    value: 'Ấp Cồn Phụng, Xã An Thạnh, Huyện Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long',
    href: 'https://maps.google.com/?q=10.3367211,106.3687357',
  },
  {
    icon: Clock,
    label: 'Giờ làm việc',
    value: 'Thứ 2 - CN: 7:00 - 18:00',
  },
]

export function ModernFooter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    // Simulate API call
    setTimeout(() => {
      setMessage('Đăng ký thành công! Cảm ơn bạn đã quan tâm.')
      setEmail('')
      setIsSubmitting(false)
      setTimeout(() => setMessage(''), 3000)
    }, 1000)
  }

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        
        {/* Team Members Section - LIÊN HỆ */}
        <FadeIn direction="up" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent mb-3">
              LIÊN HỆ
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Đội ngũ chuyên nghiệp, tận tâm phục vụ quý khách
            </p>
          </div>
          
          <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <StaggerItem key={index}>
                <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary/10 to-emerald-500/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Image
                      src={member.imgSrc}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {member.title}
                    </p>
                    
                    {/* Contact Buttons */}
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        className="btn-gradient"
                        asChild
                      >
                        <Link href={`tel:${member.phone || '0918267715'}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          Gọi ngay
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link href={`https://zalo.me/${member.phone || '0918267715'}`} target="_blank">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Zalo
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeIn>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-12"></div>

        {/* Main Footer Content */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Company Info */}
          <StaggerItem>
            <FadeIn direction="up">
              <div className="space-y-4">
                <Link href="/" className="inline-block">
                  <Image
                    src={Logo}
                    alt="Cồn Phụng Logo"
                    width={160}
                    height={48}
                    className="h-12 w-auto"
                    style={{ height: 'auto' }}
                  />
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Khám phá vẻ đẹp thiên nhiên và văn hóa độc đáo của miền Tây tại Khu Du Lịch Cồn Phụng - 
                  Công trình kiến trúc Đạo Dừa nổi tiếng.
                </p>
                
                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300 hover:text-white hover:-translate-y-1 hover:shadow-lg ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          </StaggerItem>

          {/* Quick Links - Company */}
          <StaggerItem>
            <FadeIn direction="up" delay={0.1}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Công ty</h3>
                <ul className="space-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </StaggerItem>

          {/* Quick Links - Services */}
          <StaggerItem>
            <FadeIn direction="up" delay={0.2}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dịch vụ</h3>
                <ul className="space-y-2">
                  {footerLinks.services.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </StaggerItem>

          {/* Contact Info & Newsletter */}
          <StaggerItem>
            <FadeIn direction="up" delay={0.3}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Liên hệ</h3>
                <ul className="space-y-3">
                  {contactInfo.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        {item.href ? (
                          <Link
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className={
                              item.label === 'Hotline'
                                ? 'inline-flex items-center justify-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-bold text-primary shadow-lg transition-all duration-300 hover:bg-primary/20 hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-105'
                                : 'text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors'
                            }
                          >
                            {item.value}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.value}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Newsletter */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold mb-2">Đăng ký nhận tin</h4>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isSubmitting}
                        className="btn-gradient"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    {message && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {message}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </FadeIn>
          </StaggerItem>
        </StaggerContainer>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-8"></div>

        {/* Company Legal Info */}
        <FadeIn delay={0.4}>
          <div className="bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-xl p-6 mb-8">
            <div className="text-center space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-900 dark:text-white">
                CÔNG TY TNHH DU LỊCH DỊCH VỤ THƯƠNG MẠI CỒN PHỤNG
              </p>
              <p>Mã số thuế: 1300390306</p>
              <p>Địa chỉ: Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long</p>
              <p>GIẤY PHÉP KINH DOANH DỊCH VỤ LỮ HÀNH QUỐC TẾ - Số GP/No. : 83-005/2019 /TCDL-GP LHQT</p>
              <p>GIẤY CHỨNG NHẬN CƠ SỞ ĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM SỐ: 71/2021./ATTP-CNĐK</p>
              <p>Số tài khoản: 7210783403 - BIDV chi nhánh Bến Tre</p>
            </div>
          </div>
        </FadeIn>

        {/* Bottom Bar */}
        <FadeIn delay={0.5}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()}{' '}
              <Link href="/" className="hover:text-primary transition-colors font-medium">
                Khu Du Lịch Cồn Phụng
              </Link>
              . All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/chinh-sach-bao-mat" className="hover:text-primary transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/dieu-khoan" className="hover:text-primary transition-colors">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Decorative Wave */}
      <div className="relative h-12 bg-primary/5">
        <svg
          className="absolute bottom-0 w-full h-12"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,80 350,80 600,50 C850,20 1050,20 1200,50 L1200,120 L0,120 Z"
            className="fill-white dark:fill-gray-950"
          />
        </svg>
      </div>
    </footer>
  )
}

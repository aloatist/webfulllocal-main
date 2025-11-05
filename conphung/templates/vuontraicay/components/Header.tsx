'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Apple, Phone } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Trang Chủ' },
    { href: '/about', label: 'Giới Thiệu' },
    { href: '/tours', label: 'Tours' },
    { href: '/contact', label: 'Liên Hệ' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b-2 border-green-100 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <Apple className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Miệt Vườn Trái Cây
              </div>
              <div className="text-xs text-green-600">Du Lịch Vườn Cây</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-green-700 font-medium hover:bg-green-50 hover:text-green-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="tel:+84918267715"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Đặt Tour</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-green-700 hover:bg-green-50 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-green-100 mt-2 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="tel:+84918267715"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-lg font-semibold mt-2"
            >
              <Phone className="w-4 h-4" />
              <span>Đặt Tour</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}


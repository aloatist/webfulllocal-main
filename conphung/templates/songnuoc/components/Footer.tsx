import Link from 'next/link';
import { Ship, Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 text-white mt-20">
      {/* Decorative wave */}
      <div className="relative">
        <svg className="w-full h-16 fill-blue-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 Q300,80 600,40 T1200,60 L1200,120 L0,120 Z" className="fill-current text-blue-50" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ship className="w-6 h-6 text-cyan-300" />
              <h3 className="text-xl font-bold">Sông Nước Miền Tây</h3>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Du lịch sinh thái sông nước, khám phá văn hóa miền Tây trên những con sông hiền hòa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-cyan-200">Liên Kết Nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-blue-200 hover:text-white transition-colors">Trang Chủ</Link></li>
              <li><Link href="/about" className="text-blue-200 hover:text-white transition-colors">Giới Thiệu</Link></li>
              <li><Link href="/tours" className="text-blue-200 hover:text-white transition-colors">Tour du lịch</Link></li>
              <li><Link href="/contact" className="text-blue-200 hover:text-white transition-colors">Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-cyan-200">Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                <span className="text-blue-200">0918 267 715</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                <span className="text-blue-200">info@conphung.vn</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                <span className="text-blue-200">Ấp Tân Vinh, Xã Phú Túc, Vĩnh Long</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-cyan-200">Theo Dõi</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-blue-700 rounded-lg hover:bg-cyan-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-blue-700 rounded-lg hover:bg-cyan-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-blue-700 pt-6 text-center text-sm text-blue-200">
          <p>&copy; {new Date().getFullYear()} Sông Nước Miền Tây. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
}

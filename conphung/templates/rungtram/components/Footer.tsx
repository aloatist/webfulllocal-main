import Link from 'next/link';
import { TreePine, Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-stone-900 via-green-900 to-stone-800 text-white mt-20">
      <div className="relative">
        <svg className="w-full h-16 fill-stone-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 Q300,80 600,40 T1200,60 L1200,120 L0,120 Z" className="fill-current text-green-50" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TreePine className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">Rừng Tràm Sân Chim</h3>
            </div>
            <p className="text-green-200 text-sm leading-relaxed">
              Du lịch rừng tràm - sân chim, khám phá thiên nhiên hoang sơ, đầm lầy, bèo nước.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-green-400">Liên Kết Nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-green-200 hover:text-white transition-colors">Trang Chủ</Link></li>
              <li><Link href="/about" className="text-green-200 hover:text-white transition-colors">Giới Thiệu</Link></li>
              <li><Link href="/tours" className="text-green-200 hover:text-white transition-colors">Tours</Link></li>
              <li><Link href="/contact" className="text-green-200 hover:text-white transition-colors">Liên Hệ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-green-400">Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-green-200">0918 267 715</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-green-200">info@conphung.vn</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-green-200">Ấp Tân Vinh, Xã Phú Túc, Vĩnh Long</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-green-400">Theo Dõi</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-green-800 rounded-lg hover:bg-green-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-green-800 rounded-lg hover:bg-green-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 pt-6 text-center text-sm text-green-200">
          <p>&copy; {new Date().getFullYear()} Rừng Tràm Sân Chim. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


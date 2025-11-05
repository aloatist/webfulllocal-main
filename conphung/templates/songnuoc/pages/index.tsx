import Layout from '../layout/Layout';
import Button from '../components/Button';
import { Waves, Ship, Fish, MapPin, Clock, Users } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-400/20 to-blue-600/30" />
          <div className="absolute inset-0 bg-[url('/themes/songnuoc/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        </div>

        {/* Water waves animation */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-blue-500 animate-pulse"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border-2 border-blue-300 shadow-xl">
              <Waves className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-700">Sông Nước Miền Tây</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight" style={{
              textShadow: '3px 3px 6px rgba(0,0,0,0.5), 0 0 30px rgba(59,130,246,0.5)'
            }}>
              <span className="block bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100 bg-clip-text text-transparent mb-2">
                Khám Phá
              </span>
              <span className="block text-white">Sông Nước Miền Tây</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed" style={{
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
            }}>
              Du lịch sinh thái trên sông nước, tham quan chợ nổi, trải nghiệm đời sống ghe thuyền
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button href="/tours" variant="primary" size="lg">
                <Ship className="w-5 h-5 mr-2" />
                Xem Tours
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                <MapPin className="w-5 h-5 mr-2" />
                Liên Hệ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Trải Nghiệm Độc Đáo
            </h2>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto">
              Khám phá vẻ đẹp sông nước miền Tây với những trải nghiệm không thể quên
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Ship,
                title: 'Đi Ghe Thuyền',
                description: 'Trải nghiệm đi ghe trên sông, ngắm cảnh hai bên bờ sông',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Fish,
                title: 'Chợ Nổi',
                description: 'Tham quan chợ nổi truyền thống, mua sắm trên sông',
                color: 'from-cyan-500 to-blue-500',
              },
              {
                icon: Waves,
                title: 'Sinh Thái',
                description: 'Khám phá hệ sinh thái sông nước, động thực vật đặc trưng',
                color: 'from-blue-400 to-cyan-400',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-blue-700 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Preview */}
      <section className="py-20 bg-gradient-to-br from-blue-100 to-cyan-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Tours Sông Nước
            </h2>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto">
              Các tour đặc biệt khám phá sông nước miền Tây
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Tour Chợ Nổi',
                description: 'Tham quan chợ nổi, mua sắm trên sông',
                duration: '1 ngày',
                price: '500,000₫',
              },
              {
                title: 'Tour Ghe Thuyền',
                description: 'Đi ghe thuyền khám phá sông nước',
                duration: 'Nửa ngày',
                price: '300,000₫',
              },
              {
                title: 'Tour Sinh Thái',
                description: 'Khám phá hệ sinh thái sông nước',
                duration: '2 ngày 1 đêm',
                price: '1,200,000₫',
              },
            ].map((tour, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{tour.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-blue-700 mb-4">{tour.description}</p>
                  <div className="flex items-center justify-between text-sm text-blue-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="font-bold text-blue-900 text-lg">{tour.price}</div>
                  </div>
                  <Button href="/tours" variant="primary" size="sm" className="w-full">
                    Xem Chi Tiết
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/tours" variant="primary" size="lg">
              Xem Tất Cả Tours
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Sẵn Sàng Khám Phá Sông Nước?
            </h2>
            <p className="text-xl text-blue-100">
              Đặt tour ngay để trải nghiệm vẻ đẹp sông nước miền Tây
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="tel:+84918267715" variant="secondary" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Gọi Ngay: 0918 267 715
              </Button>
              <Button href="/tours" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Xem Tours
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


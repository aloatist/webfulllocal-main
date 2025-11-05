import Layout from '../layout/Layout';
import Button from '../components/Button';
import { TreePine, Bird, Water, MapPin, Phone } from 'lucide-react';

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-800/30 via-stone-700/30 to-green-900/40" />
          <div className="absolute inset-0 bg-[url('/themes/rungtram/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        </div>

        {/* Swamp pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,80 Q150,40 300,80 T600,80 T900,80 T1200,80 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-green-700"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-stone-900/90 backdrop-blur-md px-5 py-2.5 rounded-full border-2 border-green-600 shadow-xl">
              <TreePine className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold text-green-300">Rừng Tràm Sân Chim</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight" style={{
              textShadow: '3px 3px 6px rgba(0,0,0,0.7), 0 0 30px rgba(101,163,13,0.5)'
            }}>
              <span className="block bg-gradient-to-r from-green-200 via-stone-200 to-green-200 bg-clip-text text-transparent mb-2">
                Khám Phá
              </span>
              <span className="block text-white">Rừng Tràm Sân Chim</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-green-100 max-w-2xl mx-auto leading-relaxed" style={{
              textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
            }}>
              Du lịch sinh thái rừng tràm, khám phá sân chim, đầm lầy, thiên nhiên hoang sơ
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button href="/tours" variant="primary" size="lg">
                <Bird className="w-5 h-5 mr-2" />
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
            <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              Trải Nghiệm Độc Đáo
            </h2>
            <p className="text-lg text-stone-700 max-w-2xl mx-auto">
              Khám phá vẻ đẹp hoang sơ của rừng tràm và sân chim
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TreePine,
                title: 'Rừng Tràm',
                description: 'Khám phá rừng tràm rộng lớn, hệ sinh thái đa dạng',
                color: 'from-green-700 to-stone-700',
              },
              {
                icon: Bird,
                title: 'Sân Chim',
                description: 'Ngắm các loài chim quý hiếm, tìm hiểu về chim',
                color: 'from-stone-700 to-green-700',
              },
              {
                icon: Water,
                title: 'Đầm Lầy',
                description: 'Tham quan đầm lầy, bèo nước, hệ sinh thái nước',
                color: 'from-green-600 to-stone-600',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-stone-50 to-green-50 rounded-2xl border-2 border-green-200 hover:border-green-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-stone-700 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Preview */}
      <section className="py-20 bg-gradient-to-br from-green-100 to-stone-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              Tours Rừng Tràm
            </h2>
            <p className="text-lg text-stone-700 max-w-2xl mx-auto">
              Các tour đặc biệt khám phá rừng tràm và sân chim
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Tour Sân Chim',
                description: 'Tham quan sân chim, ngắm các loài chim quý hiếm',
                duration: '1 ngày',
                price: '700,000₫',
              },
              {
                title: 'Tour Rừng Tràm',
                description: 'Khám phá rừng tràm, tìm hiểu hệ sinh thái',
                duration: 'Nửa ngày',
                price: '450,000₫',
              },
              {
                title: 'Tour Đầm Lầy',
                description: 'Tham quan đầm lầy, bèo nước, nghỉ đêm',
                duration: '2 ngày 1 đêm',
                price: '1,800,000₫',
              },
            ].map((tour, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-green-700 to-stone-700 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{tour.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-stone-700 mb-4">{tour.description}</p>
                  <div className="flex items-center justify-between text-sm text-green-700 mb-4">
                    <div className="flex items-center gap-2">
                      <span>{tour.duration}</span>
                    </div>
                    <div className="font-bold text-green-900 text-lg">{tour.price}</div>
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
      <section className="py-20 bg-gradient-to-br from-green-800 via-stone-800 to-green-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Sẵn Sàng Khám Phá Rừng Tràm?
            </h2>
            <p className="text-xl text-green-200">
              Đặt tour ngay để trải nghiệm thiên nhiên hoang sơ
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


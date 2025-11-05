import Layout from '../layout/Layout';
import Button from '../components/Button';
import { Apple, TreePine, Sprout, MapPin, Phone } from 'lucide-react';

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-400/20 to-yellow-400/30" />
          <div className="absolute inset-0 bg-[url('/themes/vuontraicay/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        </div>

        {/* Fruit pattern overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <div className="flex justify-center gap-8">
            {[...Array(5)].map((_, i) => (
              <Apple key={i} className="w-16 h-16 text-yellow-400 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border-2 border-green-300 shadow-xl">
              <Sprout className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-700">Miệt Vườn Trái Cây</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight" style={{
              textShadow: '3px 3px 6px rgba(0,0,0,0.5), 0 0 30px rgba(34,197,94,0.5)'
            }}>
              <span className="block bg-gradient-to-r from-green-100 via-yellow-100 to-green-100 bg-clip-text text-transparent mb-2">
                Khám Phá
              </span>
              <span className="block text-white">Miệt Vườn Trái Cây</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-green-100 max-w-2xl mx-auto leading-relaxed" style={{
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
            }}>
              Du lịch vườn cây ăn trái, thưởng thức nông sản tươi ngon, trải nghiệm cuộc sống miền quê
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button href="/tours" variant="primary" size="lg">
                <TreePine className="w-5 h-5 mr-2" />
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
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Khám phá vẻ đẹp vườn cây trái cây miền Tây với những trải nghiệm không thể quên
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TreePine,
                title: 'Vườn Cây Ăn Trái',
                description: 'Tham quan các vườn cây trái cây, học cách trồng và chăm sóc',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Apple,
                title: 'Nông Sản Tươi',
                description: 'Thưởng thức trái cây tươi ngon, hái trực tiếp từ cây',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Sprout,
                title: 'Cuộc Sống Miền Quê',
                description: 'Trải nghiệm cuộc sống miền quê, làm vườn, chăm sóc cây',
                color: 'from-green-400 to-yellow-400',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl border-2 border-green-100 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-green-700 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Preview */}
      <section className="py-20 bg-gradient-to-br from-green-100 to-yellow-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              Tours Vườn Trái Cây
            </h2>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Các tour đặc biệt khám phá miệt vườn trái cây
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Tour Vườn Sầu Riêng',
                description: 'Tham quan vườn sầu riêng, thưởng thức trái cây',
                duration: '1 ngày',
                price: '600,000₫',
              },
              {
                title: 'Tour Vườn Cây Tổng Hợp',
                description: 'Tham quan nhiều vườn cây khác nhau, hái trái cây',
                duration: 'Nửa ngày',
                price: '400,000₫',
              },
              {
                title: 'Tour Trải Nghiệm',
                description: 'Làm vườn, chăm sóc cây, học cách trồng trọt',
                duration: '2 ngày 1 đêm',
                price: '1,500,000₫',
              },
            ].map((tour, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-green-400 to-yellow-400 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{tour.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-green-700 mb-4">{tour.description}</p>
                  <div className="flex items-center justify-between text-sm text-green-600 mb-4">
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
      <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Sẵn Sàng Khám Phá Vườn Trái Cây?
            </h2>
            <p className="text-xl text-green-100">
              Đặt tour ngay để trải nghiệm vẻ đẹp miệt vườn trái cây
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


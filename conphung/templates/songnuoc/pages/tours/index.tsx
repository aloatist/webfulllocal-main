import Layout from '../../layout/Layout';
import Button from '../../components/Button';
import Link from 'next/link';
import { Ship, Clock, MapPin, Users } from 'lucide-react';

const tours = [
  {
    slug: 'tour-cho-noi',
    title: 'Tour Chợ Nổi Cái Răng',
    description: 'Tham quan chợ nổi Cái Răng nổi tiếng, mua sắm trên sông, thưởng thức ẩm thực miền Tây',
    duration: '1 ngày',
    price: '500,000₫',
    image: '/themes/songnuoc/tour-1.jpg',
  },
  {
    slug: 'tour-ghe-thuyen',
    title: 'Tour Đi Ghe Thuyền',
    description: 'Trải nghiệm đi ghe trên sông, ngắm cảnh hai bên bờ, tham quan làng nghề',
    duration: 'Nửa ngày',
    price: '300,000₫',
    image: '/themes/songnuoc/tour-2.jpg',
  },
  {
    slug: 'tour-sinh-thai',
    title: 'Tour Sinh Thái Sông Nước',
    description: 'Khám phá hệ sinh thái sông nước, động thực vật đặc trưng miền Tây',
    duration: '2 ngày 1 đêm',
    price: '1,200,000₫',
    image: '/themes/songnuoc/tour-3.jpg',
  },
];

export default function ToursPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Tours Sông Nước</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Khám phá miền Tây sông nước với các tour đặc biệt
          </p>
        </div>
      </section>

      {/* Tours List */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <Link
                key={tour.slug}
                href={`/tours/${tour.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400 relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <Ship className="absolute top-4 right-4 w-12 h-12 text-white opacity-80" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-blue-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-blue-700 mb-4 leading-relaxed">
                    {tour.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-blue-600 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration}</span>
                      </div>
                    </div>
                    <div className="font-bold text-blue-900 text-lg">
                      {tour.price}
                    </div>
                  </div>

                  <Button variant="primary" size="sm" className="w-full">
                    Xem Chi Tiết
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}


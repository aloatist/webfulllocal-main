import Layout from '../../layout/Layout';
import Button from '../../components/Button';
import Link from 'next/link';
import { Bird, Clock } from 'lucide-react';

const tours = [
  {
    slug: 'tour-san-chim',
    title: 'Tour Sân Chim',
    description: 'Tham quan sân chim, ngắm các loài chim quý hiếm, tìm hiểu về chim',
    duration: '1 ngày',
    price: '700,000₫',
  },
  {
    slug: 'tour-rung-tram',
    title: 'Tour Rừng Tràm',
    description: 'Khám phá rừng tràm, tìm hiểu hệ sinh thái, ngắm cảnh',
    duration: 'Nửa ngày',
    price: '450,000₫',
  },
  {
    slug: 'tour-dam-lay',
    title: 'Tour Đầm Lầy',
    description: 'Tham quan đầm lầy, bèo nước, nghỉ đêm tại rừng',
    duration: '2 ngày 1 đêm',
    price: '1,800,000₫',
  },
];

export default function ToursPage() {
  return (
    <Layout>
      <section className="relative py-20 bg-gradient-to-br from-green-800 via-stone-800 to-green-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Tours Rừng Tràm</h1>
          <p className="text-xl text-green-200 max-w-2xl mx-auto">
            Khám phá rừng tràm và sân chim với các tour đặc biệt
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <Link
                key={tour.slug}
                href={`/tours/${tour.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-green-700 to-stone-700 relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <Bird className="absolute top-4 right-4 w-12 h-12 text-white opacity-80" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-stone-700 mb-4 leading-relaxed">
                    {tour.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-green-700 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="font-bold text-green-900 text-lg">
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


import Layout from '../../layout/Layout';
import Button from '../../components/Button';
import Link from 'next/link';
import { TreePine, Clock } from 'lucide-react';

const tours = [
  {
    slug: 'tour-sau-rieng',
    title: 'Tour Vườn Sầu Riêng',
    description: 'Tham quan vườn sầu riêng, thưởng thức trái cây, học cách trồng và chăm sóc',
    duration: '1 ngày',
    price: '600,000₫',
  },
  {
    slug: 'tour-vuon-tong-hop',
    title: 'Tour Vườn Cây Tổng Hợp',
    description: 'Tham quan nhiều vườn cây khác nhau, hái trái cây, thưởng thức nông sản',
    duration: 'Nửa ngày',
    price: '400,000₫',
  },
  {
    slug: 'tour-trai-nghiem',
    title: 'Tour Trải Nghiệm',
    description: 'Làm vườn, chăm sóc cây, học cách trồng trọt, nghỉ đêm tại vườn',
    duration: '2 ngày 1 đêm',
    price: '1,500,000₫',
  },
];

export default function ToursPage() {
  return (
    <Layout>
      <section className="relative py-20 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Tours Vườn Trái Cây</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Khám phá miệt vườn trái cây với các tour đặc biệt
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
                <div className="h-48 bg-gradient-to-br from-green-400 to-yellow-400 relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <TreePine className="absolute top-4 right-4 w-12 h-12 text-white opacity-80" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-green-700 mb-4 leading-relaxed">
                    {tour.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-green-600 mb-4">
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


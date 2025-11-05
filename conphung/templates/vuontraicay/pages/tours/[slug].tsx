import Layout from '../../layout/Layout';
import Button from '../../components/Button';
import { Clock, Check, TreePine } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

const tourData: Record<string, any> = {
  'tour-sau-rieng': {
    title: 'Tour Vườn Sầu Riêng',
    description: 'Tham quan vườn sầu riêng, thưởng thức trái cây, học cách trồng và chăm sóc',
    duration: '1 ngày',
    price: '600,000₫',
    includes: [
      'Tham quan vườn sầu riêng',
      'Thưởng thức trái cây tươi',
      'Học cách trồng và chăm sóc',
      'Ăn trưa tại vườn',
      'Hướng dẫn viên địa phương',
    ],
  },
  'tour-vuon-tong-hop': {
    title: 'Tour Vườn Cây Tổng Hợp',
    description: 'Tham quan nhiều vườn cây khác nhau, hái trái cây, thưởng thức nông sản',
    duration: 'Nửa ngày',
    price: '400,000₫',
    includes: [
      'Tham quan 3-4 vườn cây khác nhau',
      'Hái trái cây trực tiếp',
      'Thưởng thức nông sản',
      'Hướng dẫn viên',
    ],
  },
  'tour-trai-nghiem': {
    title: 'Tour Trải Nghiệm',
    description: 'Làm vườn, chăm sóc cây, học cách trồng trọt, nghỉ đêm tại vườn',
    duration: '2 ngày 1 đêm',
    price: '1,500,000₫',
    includes: [
      'Làm vườn và chăm sóc cây',
      'Học cách trồng trọt',
      'Nghỉ đêm tại vườn',
      'Ăn sáng và trưa',
      'Hướng dẫn viên chuyên nghiệp',
    ],
  },
};

export default function TourDetailPage({ params }: PageProps) {
  const tour = tourData[params.slug];

  if (!tour) {
    notFound();
  }

  return (
    <Layout>
      <section className="relative py-20 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">{tour.title}</h1>
            <p className="text-xl text-green-100">{tour.description}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="h-96 bg-gradient-to-br from-green-400 to-yellow-400 rounded-2xl flex items-center justify-center">
                  <TreePine className="w-24 h-24 text-white opacity-50" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-green-900 mb-4">Mô Tả Tour</h2>
                  <p className="text-green-700 leading-relaxed">
                    {tour.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-green-900 mb-4">Bao Gồm</h2>
                  <ul className="space-y-3">
                    {tour.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-green-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-6 border-2 border-green-200 sticky top-24">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-extrabold text-green-900 mb-2">
                      {tour.price}
                    </div>
                    <div className="text-green-700">/người</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-green-700">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span>{tour.duration}</span>
                    </div>
                  </div>

                  <Button href="tel:+84918267715" variant="primary" size="lg" className="w-full mb-4">
                    Đặt Tour Ngay
                  </Button>
                  <Button href="/tours" variant="outline" size="md" className="w-full">
                    Quay Lại Tours
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


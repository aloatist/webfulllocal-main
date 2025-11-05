import Layout from '../../layout/Layout';
import Button from '../../components/Button';
import { Clock, Check, Bird } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

const tourData: Record<string, any> = {
  'tour-san-chim': {
    title: 'Tour Sân Chim',
    description: 'Tham quan sân chim, ngắm các loài chim quý hiếm, tìm hiểu về chim',
    duration: '1 ngày',
    price: '700,000₫',
    includes: [
      'Tham quan sân chim',
      'Ngắm các loài chim quý hiếm',
      'Tìm hiểu về chim',
      'Ăn trưa tại rừng',
      'Hướng dẫn viên chuyên nghiệp',
    ],
  },
  'tour-rung-tram': {
    title: 'Tour Rừng Tràm',
    description: 'Khám phá rừng tràm, tìm hiểu hệ sinh thái, ngắm cảnh',
    duration: 'Nửa ngày',
    price: '450,000₫',
    includes: [
      'Khám phá rừng tràm',
      'Tìm hiểu hệ sinh thái',
      'Ngắm cảnh thiên nhiên',
      'Hướng dẫn viên',
    ],
  },
  'tour-dam-lay': {
    title: 'Tour Đầm Lầy',
    description: 'Tham quan đầm lầy, bèo nước, nghỉ đêm tại rừng',
    duration: '2 ngày 1 đêm',
    price: '1,800,000₫',
    includes: [
      'Tham quan đầm lầy',
      'Ngắm bèo nước',
      'Nghỉ đêm tại rừng',
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
      <section className="relative py-20 bg-gradient-to-br from-green-800 via-stone-800 to-green-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">{tour.title}</h1>
            <p className="text-xl text-green-200">{tour.description}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="h-96 bg-gradient-to-br from-green-700 to-stone-700 rounded-2xl flex items-center justify-center">
                  <Bird className="w-24 h-24 text-white opacity-50" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-green-900 mb-4">Mô Tả Tour</h2>
                  <p className="text-stone-700 leading-relaxed">
                    {tour.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-green-900 mb-4">Bao Gồm</h2>
                  <ul className="space-y-3">
                    {tour.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5" />
                        <span className="text-stone-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="bg-gradient-to-br from-stone-50 to-green-50 rounded-2xl p-6 border-2 border-green-200 sticky top-24">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-extrabold text-green-900 mb-2">
                      {tour.price}
                    </div>
                    <div className="text-stone-700">/người</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-stone-700">
                      <Clock className="w-5 h-5 text-green-700" />
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


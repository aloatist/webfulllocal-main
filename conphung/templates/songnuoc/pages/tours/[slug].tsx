import Layout from '../../layout/Layout';
import Button from '../../components/Button';
import { Clock, MapPin, Users, Check, Ship, Waves } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

const tourData: Record<string, any> = {
  'tour-cho-noi': {
    title: 'Tour Chợ Nổi Cái Răng',
    description: 'Tham quan chợ nổi Cái Răng nổi tiếng, mua sắm trên sông, thưởng thức ẩm thực miền Tây',
    duration: '1 ngày',
    price: '500,000₫',
    includes: [
      'Đi ghe thuyền tham quan chợ nổi',
      'Mua sắm trên sông',
      'Ăn trưa ẩm thực miền Tây',
      'Hướng dẫn viên địa phương',
      'Bảo hiểm du lịch',
    ],
  },
  'tour-ghe-thuyen': {
    title: 'Tour Đi Ghe Thuyền',
    description: 'Trải nghiệm đi ghe trên sông, ngắm cảnh hai bên bờ, tham quan làng nghề',
    duration: 'Nửa ngày',
    price: '300,000₫',
    includes: [
      'Đi ghe thuyền trên sông',
      'Ngắm cảnh hai bên bờ',
      'Tham quan làng nghề',
      'Hướng dẫn viên',
    ],
  },
  'tour-sinh-thai': {
    title: 'Tour Sinh Thái Sông Nước',
    description: 'Khám phá hệ sinh thái sông nước, động thực vật đặc trưng miền Tây',
    duration: '2 ngày 1 đêm',
    price: '1,200,000₫',
    includes: [
      'Đi ghe khám phá sông nước',
      'Ngắm động thực vật',
      'Nghỉ đêm tại homestay',
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
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">{tour.title}</h1>
            <p className="text-xl text-blue-100">{tour.description}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                {/* Image */}
                <div className="h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <Ship className="w-24 h-24 text-white opacity-50" />
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">Mô Tả Tour</h2>
                  <p className="text-blue-700 leading-relaxed">
                    {tour.description}
                  </p>
                </div>

                {/* Includes */}
                <div>
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">Bao Gồm</h2>
                  <ul className="space-y-3">
                    {tour.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 sticky top-24">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-extrabold text-blue-900 mb-2">
                      {tour.price}
                    </div>
                    <div className="text-blue-700">/người</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-blue-700">
                      <Clock className="w-5 h-5 text-blue-600" />
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


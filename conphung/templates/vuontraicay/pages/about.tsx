import Layout from '../layout/Layout';
import { Apple, Heart, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout>
      <section className="relative py-20 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Giới Thiệu</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Khám phá vẻ đẹp và văn hóa độc đáo của miệt vườn trái cây miền Tây
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-3xl font-bold text-green-900 mb-6">Về Miệt Vườn Trái Cây</h2>
            <p className="text-green-700 leading-relaxed mb-6">
              Miệt vườn trái cây miền Tây là vùng đất phì nhiêu, nơi các loại cây ăn trái phát triển
              tươi tốt, tạo nên những vườn cây xanh mướt và trĩu quả.
            </p>
            <p className="text-green-700 leading-relaxed mb-6">
              Tại đây, bạn sẽ được tham quan các vườn cây trái cây đa dạng, thưởng thức trái cây tươi ngon
              hái trực tiếp từ cây, học cách trồng và chăm sóc cây, và trải nghiệm cuộc sống miền quê thanh bình.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Heart, title: 'Tận Tâm', desc: 'Phục vụ tận tình' },
                { icon: Award, title: 'Chất Lượng', desc: 'Tour đảm bảo chất lượng' },
                { icon: Users, title: 'Kinh Nghiệm', desc: '15+ năm kinh nghiệm' },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl">
                  <item.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-900 mb-2">{item.title}</h3>
                  <p className="text-green-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


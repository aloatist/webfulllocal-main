import Layout from '../layout/Layout';
import { Waves, Heart, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Giới Thiệu</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Khám phá vẻ đẹp và văn hóa độc đáo của miền Tây sông nước
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Về Sông Nước Miền Tây</h2>
            <p className="text-blue-700 leading-relaxed mb-6">
              Miền Tây sông nước là vùng đất đặc biệt của Việt Nam, nơi những con sông hiền hòa
              chảy qua các cánh đồng xanh mướt, tạo nên một không gian sống độc đáo và thú vị.
            </p>
            <p className="text-blue-700 leading-relaxed mb-6">
              Tại đây, bạn sẽ được trải nghiệm đời sống trên sông nước, tham quan chợ nổi truyền thống,
              đi ghe thuyền khám phá những con kênh rạch, và tìm hiểu về văn hóa đặc sắc của người dân miền Tây.
            </p>

            {/* Values */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Heart, title: 'Tận Tâm', desc: 'Phục vụ tận tình' },
                { icon: Award, title: 'Chất Lượng', desc: 'Tour đảm bảo chất lượng' },
                { icon: Users, title: 'Kinh Nghiệm', desc: '15+ năm kinh nghiệm' },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{item.title}</h3>
                  <p className="text-blue-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


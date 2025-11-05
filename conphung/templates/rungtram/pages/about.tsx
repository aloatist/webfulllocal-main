import Layout from '../layout/Layout';
import { TreePine, Heart, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout>
      <section className="relative py-20 bg-gradient-to-br from-green-800 via-stone-800 to-green-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Giới Thiệu</h1>
          <p className="text-xl text-green-200 max-w-2xl mx-auto">
            Khám phá vẻ đẹp hoang sơ của rừng tràm và sân chim
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-3xl font-bold text-green-900 mb-6">Về Rừng Tràm Sân Chim</h2>
            <p className="text-stone-700 leading-relaxed mb-6">
              Rừng tràm và sân chim là hệ sinh thái độc đáo của miền Tây, nơi thiên nhiên hoang sơ
              vẫn còn được bảo tồn, tạo nên một không gian sống đặc biệt cho nhiều loài động thực vật quý hiếm.
            </p>
            <p className="text-stone-700 leading-relaxed mb-6">
              Tại đây, bạn sẽ được khám phá rừng tràm rộng lớn, ngắm các loài chim quý hiếm tại sân chim,
              tham quan đầm lầy và bèo nước, tìm hiểu về hệ sinh thái đa dạng và trải nghiệm thiên nhiên hoang sơ.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Heart, title: 'Tận Tâm', desc: 'Phục vụ tận tình' },
                { icon: Award, title: 'Chất Lượng', desc: 'Tour đảm bảo chất lượng' },
                { icon: Users, title: 'Kinh Nghiệm', desc: '15+ năm kinh nghiệm' },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 bg-gradient-to-br from-stone-50 to-green-50 rounded-xl">
                  <item.icon className="w-12 h-12 text-green-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-900 mb-2">{item.title}</h3>
                  <p className="text-stone-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


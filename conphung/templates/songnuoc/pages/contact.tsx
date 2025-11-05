import Layout from '../layout/Layout';
import Button from '../components/Button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Liên Hệ</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Chúng tôi sẵn sàng hỗ trợ bạn mọi lúc
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  icon: Phone,
                  title: 'Điện Thoại',
                  content: '0918 267 715',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Mail,
                  title: 'Email',
                  content: 'info@conphung.vn',
                  color: 'from-cyan-500 to-blue-500',
                },
                {
                  icon: MapPin,
                  title: 'Địa Chỉ',
                  content: 'Ấp Tân Vinh, Xã Phú Túc, Vĩnh Long',
                  color: 'from-blue-400 to-cyan-400',
                },
                {
                  icon: Clock,
                  title: 'Giờ Làm Việc',
                  content: '7:00 - 18:00 (Hàng ngày)',
                  color: 'from-blue-500 to-cyan-500',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100 text-center"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{item.title}</h3>
                  <p className="text-blue-700">{item.content}</p>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
              <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                Gửi Tin Nhắn
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-blue-900 font-semibold mb-2">Họ Tên</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-semibold mb-2">Tin Nhắn</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                    placeholder="Nhập tin nhắn"
                  />
                </div>
                <Button variant="primary" size="lg" className="w-full">
                  Gửi Tin Nhắn
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


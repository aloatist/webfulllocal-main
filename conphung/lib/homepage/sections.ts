import { prisma } from '@/lib/prisma';
import { homepageConfigSchema, type HomepageConfig } from './schema';

export const DEFAULT_CONFIG: HomepageConfig = {
  hero: {
    eyebrow: '🌿 Du lịch Sinh Thái Chính Chủ',
    mainTitle: 'Thiên Nhiên Miền Tây',
    subtitle: 'Công Trình Kiến Trúc Đạo Dừa',
    description: 'Trải nghiệm du lịch xanh, bền vững tại Cồn Phụng - Nơi hòa quyện giữa thiên nhiên và văn hóa miền sông nước',
    backgroundImage: '/uploads/anhbiadulichconphung.webp',
    phone: '+84918267715',
    address: 'Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long',
    openingHours: '7:00 - 18:00',
    primaryCta: {
      text: '☎️ Đặt Tour Ngay',
      link: 'tel:+84918267715',
    },
    secondaryCta: {
      text: 'Xem Tour',
      link: '/tours',
    },
    usps: [
      '🌿 Thân Thiện Môi Trường',
      '🍃 Trải Nghiệm Xanh',
      '🌱 Chính Chủ',
    ],
  },
  features: {
    features: [
      {
        icon: 'Heart',
        title: 'TẬN TÂM VỚI KHÁCH HÀNG',
        description: 'Chúng tôi luôn tâm niệm phải tận tâm chăm sóc khách hàng từ những việc nhỏ nhất.',
        color: 'from-red-500 to-pink-500',
      },
      {
        icon: 'DollarSign',
        title: 'ĐẢM BẢO MỨC GIÁ TỐT NHẤT',
        description: 'Giá tour dịch vụ cung cấp đến quý khách luôn là mức giá ưu đãi hấp dẫn nhất.',
        color: 'from-emerald-500 to-green-500',
      },
      {
        icon: 'Headphones',
        title: 'HỖ TRỢ KHÁCH HÀNG 24/7',
        description: 'Chúng tôi luôn sẵn sàng phục vụ quý khách trước, trong và sau chuyến đi.',
        color: 'from-blue-500 to-cyan-500',
      },
    ],
  },
  certificates: {
    eyebrow: 'Giấy Phép & Chứng Nhận',
    heading: 'THÔNG TIN VỀ CHÚNG TÔI',
    description: '🏛️ Được cấp phép và công nhận bởi các cơ quan chức năng',
    certificates: [
      {
        name: 'Giấy Phép Lữ Hành',
        description: 'Quốc tế hợp pháp',
        imageUrl: '/uploads/2024/10/giay-phep-lu-hanh-735x1024.webp',
        icon: '✅',
      },
      {
        name: 'Giấy Kinh Doanh',
        description: 'Đăng ký hợp lệ',
        imageUrl: '/uploads/2024/10/giay-phep-kinh-doanh-conphung-724x2048.webp',
        icon: '🏢',
      },
      {
        name: 'An Toàn Thực Phẩm',
        description: 'Đảm bảo vệ sinh',
        imageUrl: '/uploads/2024/10/giay-an-toan-thuc-pham-con-phung-743x1024.webp',
        icon: '🍴',
      },
    ],
    bottomNote: '✅ Được Bộ Công Thương xác nhận - Đơn vị du lịch uy tín',
  },
  policyLinks: {
    title: 'Chính Sách & Điều Khoản',
    subtitle: 'Minh bạch, rõ ràng, bảo vệ quyền lợi khách hàng',
    bottomText: '📄 Tất cả chính sách tuân thủ theo quy định của pháp luật Việt Nam',
    links: [
      {
        title: 'CHÍNH SÁCH BẢO MẬT',
        href: '/chinh-sach-bao-mat',
        icon: 'icon-user',
      },
      {
        title: 'PHƯƠNG THỨC THANH TOÁN',
        href: '/phuong-thuc-thanh-toan',
        icon: 'icon-shopping-cart',
      },
      {
        title: 'CHÍNH SÁCH HỦY – HOÀN TIỀN',
        href: '/chinh-sach-huy-hoan-tien',
        icon: 'icon-checkmark',
      },
      {
        title: 'CHÍNH SÁCH – QUY ĐỊNH CHUNG',
        href: '/chinh-sach-quy-dinh-chung',
        icon: 'icon-checkmark',
      },
    ],
  },
  latestPosts: {
    heading: 'Bài viết mới nhất',
    description: 'Những câu chuyện và mẹo hữu ích dành cho hành trình khám phá Cồn Phụng.',
    ctaText: 'Xem tất cả bài viết',
    ctaLink: '/posts',
    postCount: 3,
  },
  promotion: {
    eyebrow: "Ưu đãi đặc biệt",
    heading: "🎉 GIẢM GIÁ 30% CHO TẤT CẢ CÁC GÓI TOUR",
    description: "Đặt tour trước 7 ngày để nhận ưu đãi tốt nhất. Áp dụng cho nhóm từ 10 người. Số lượng có hạn!",
    imageUrl: "/uploads/2025/01/combo-3-con-phung-768x768.webp",
    discount: "30%",
    isActive: true
  },
  pricingSnapshot: {
    paymentInfo: "💳 Thanh toán: Tiền mặt • Chuyển khoản • Ví điện tử • Miễn phí hủy trong 24h",
    eyebrow: "Giá Ưu Đãi",
    heading: "Bảng Giá Tham Khảo",
    description: "Giá ưu đãi - Minh bạch - Không phí ẩn - Cam kết giá tốt nhất",
    isActive: true,
  },
  ticket: {
    eyebrow: "Vé tham quan",
    heading: "VÉ CỔNG CHÍNH CHỦ KHU DU LỊCH CỒN PHỤNG",
    subheading: "Giá vé ưu đãi - Trực tiếp chính chủ",
    description: "Vé đã bao gồm tàu khứ hồi và tham quan các điểm trong khu du lịch",
    prices: {
      adult: 50000,
      child: 30000,
      currency: "₫"
    },
    includedItems: [
      "🚢 Miễn phí vé tàu khứ hồi",
      "🐊 Tham quan trại nuôi cá sấu",
      "🍬 Tham quan sản xuất kẹo Dừa",
      "🎨 Thủ công mỹ nghệ từ Dừa",
      "🏛️ Tham quan di tích Đạo Dừa",
      "🥥 Bảo tàng Dừa"
    ],
    pickupLocation: "Bến phà Rạch Miễu cũ, xã Tân Thạch, huyện Châu Thành, tỉnh Bến Tre",
    warningNote: "Đến bến phà, vui lòng gọi Hotline để được hỗ trợ tàu đón, tránh nhầm lẫn không phải chính chủ",
    imageUrl: "/uploads/2024/10/du-thuyen-tren-song-conphungtourisdt.com_-768x575.webp"
  },
  tourPricing: {
    eyebrow: "Tour khám phá",
    heading: "TOUR KHÁM PHÁ TRONG NGÀY CỒN THỚI SƠN – CỒN PHỤNG",
    description: "Trải nghiệm đầy đủ văn hóa miền Tây với giá ưu đãi",
    tours: [
      {
        id: "tour-1",
        name: "TOUR KHÁM PHÁ SINH THÁI",
        description: "Tour khám phá đầy đủ 2 cồn nổi tiếng nhất miền Tây",
        originalPrice: 300000,
        discount: 50,
        finalPrice: 149000,
        currency: "₫",
        imageUrl: "/uploads/2024/10/trochoidangianconphungbentre-2.conphungtourist.com_-767x1024.webp",
        duration: "1 ngày",
        isActive: true,
        order: 1,
        includedItems: [
          "🚗 Xe đưa đón",
          "🚢 Du thuyền",
          "🍽️ Ăn trưa",
          "👨‍🏫 Hướng dẫn viên"
        ]
      },
      {
        id: "tour-2",
        name: "Tour Cồn Thới Sơn - Cồn Phụng",
        description: "Tour khám phá đầy đủ 2 cồn nổi tiếng nhất miền Tây",
        originalPrice: 300000,
        discount: 50,
        finalPrice: 149000,
        currency: "₫",
        imageUrl: "/uploads/2024/10/trochoidangianconphungbentre-2.conphungtourist.com_-767x1024.webp",
        duration: "1 ngày",
        isActive: true,
        order: 2,
        includedItems: [
          "🚢 Vé tàu khứ hồi",
          "🎭 Nghe Đờn ca tài tử Nam Bộ",
          "🥥 Thưởng thức trái cây theo mùa",
          "🛶 Đi xuồng ba lá trong rạch dừa",
          "👨‍🏫 Hướng dẫn viên địa phương"
        ]
      }
    ],
    highlights: [
      { title: "Du Thuyền", description: "Tham quan sông nước", icon: "Ship" as const },
      { title: "Sinh Thái", description: "Du lịch sinh thái mát", icon: "Leaf" as const },
      { title: "2 Cồn", description: "Thới Sơn & Phụng", icon: "MapPin" as const },
      { title: "Đặc Sản", description: "Ẩm thực miền Tây", icon: "Star" as const },
    ],
    bottomNote: "💡 Bao gồm: Xe đưa đón + Du thuyền + Ăn trưa + Hướng dẫn viên"
  },
  gallery: {
    heading: "MỘT SỐ HÌNH ẢNH",
    description: "Khám phá vẻ đẹp thiên nhiên và văn hóa độc đáo của Cồn Phụng",
    ecoFeatures: [
      {
        title: "Du lịch sinh thái",
        subtitle: "Không gian sinh thái",
        icon: "trees",
      },
      {
        title: "Kiến Trúc Dừa",
        subtitle: "Độc đáo miền Tây",
        icon: "building",
      },
      {
        title: "Văn Hóa Địa Phương",
        subtitle: "Trải nghiệm đích thực",
        icon: "leaf",
      },
    ],
    bottomText: "✨ Hơn 1000+ hình ảnh đẹp về thiên nhiên, văn hóa và con người Cồn Phụng",
    images: [
      { url: "/uploads/2024/10/22196236_901710536664938_7027468764014750282_n.webp", alt: "Cồn Phụng - Du lịch sinh thái" },
      { url: "/uploads/2024/10/22405754_905859629583362_7823146011914182650_n-1.webp", alt: "Cồn Phụng - Khung cảnh thiên nhiên" },
      { url: "/uploads/2024/10/bang-tieu-bieu-song-cuu-long-600-x-600-.webp", alt: "Bảng tiêu biểu sông Cửu Long" },
      { url: "/uploads/2024/10/banh-xeo-con-phung.webp", alt: "Bánh xèo Cồn Phụng - Đặc sản miền Tây" },
      { url: "/uploads/2024/10/cabubinhconphungbentre.conphungtourist.com_.webp", alt: "Cà búp bình Cồn Phụng" },
      { url: "/uploads/2024/10/catituongchienxu.conphungtourist.com_-1024x767-1.webp", alt: "Cá tứ tượng chiên xù" },
      { url: "/uploads/2024/10/cocoislandconphugbentre-1024x767-1.webp", alt: "Coco Island Cồn Phụng" },
      { url: "/uploads/2024/10/coco-island-con-phung-ben-tre41-1024x576-1.webp", alt: "Homestay Coco Island Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com8.webp", alt: "Du lịch Cồn Phụng Bến Tre" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com9.webp", alt: "Tham quan Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com10.webp", alt: "Cồn Phụng - Điểm du lịch sinh thái" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com11.webp", alt: "Vẻ đẹp Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com12.webp", alt: "Trải nghiệm du lịch Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com13.webp", alt: "Cồn Phụng - Vườn dừa xanh mát" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com14.webp", alt: "Cảnh quan Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com15.webp", alt: "Du lịch miền Tây - Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com16.webp", alt: "Khu du lịch Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com17.webp", alt: "Thiên nhiên Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com18.webp", alt: "Cồn Phụng - Điểm đến lý tưởng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com19.webp", alt: "Du lịch sinh thái Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com20.webp", alt: "Cồn Phụng Bến Tre" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com21.webp", alt: "Văn hóa miền Tây tại Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com22.webp", alt: "Cồn Phụng - Trải nghiệm độc đáo" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com23.webp", alt: "Cảnh đẹp Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com26.webp", alt: "Du lịch Cồn Phụng - Hoạt động" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com27.webp", alt: "Cồn Phụng - Điểm đến hấp dẫn" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com28.webp", alt: "Thiên nhiên hoang sơ Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com29.webp", alt: "Cồn Phụng - Khám phá miền Tây" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com30.webp", alt: "Du lịch Cồn Phụng - Trải nghiệm" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com33.webp", alt: "Cồn Phụng - Vẻ đẹp tự nhiên" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com34.webp", alt: "Khu du lịch sinh thái Cồn Phụng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com35.webp", alt: "Cồn Phụng - Điểm đến du lịch" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com36.webp", alt: "Tham quan Cồn Phụng Bến Tre" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com37.webp", alt: "Cồn Phụng - Cảnh quan đẹp" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com38.webp", alt: "Du lịch Cồn Phụng - Thiên nhiên" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com40.webp", alt: "Cồn Phụng - Vườn dừa" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com41.webp", alt: "Cồn Phụng - Trải nghiệm văn hóa" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com42.webp", alt: "Du lịch Cồn Phụng - Hoạt động" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com44.webp", alt: "Cồn Phụng - Điểm đến lý tưởng" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com45.webp", alt: "Cồn Phụng - Vẻ đẹp miền Tây" },
      { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com46.webp", alt: "Du lịch Cồn Phụng - Khám phá" }
    ]
  },
  map: {
    heading: "ĐƯỜNG ĐẾN CỒN PHỤNG",
    description: "Hướng dẫn chi tiết cách di chuyển đến khu du lịch Cồn Phụng",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15700.258118997554!2d106.3687357!3d10.3367211!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310aaf9861803419%3A0xe04989a08949b954!2zQ-G7kk4gUEjhu6RORyBUT1VSSVNUIEtodSB2dWkgY2jGoWkgdsOgIGR1IGzhu4tjaCBC4bq_biBUcmU!5e0!3m2!1svi!2s!4v1728204449230!5m2!1svi!2s",
    address: "Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long",
    coordinates: {
      lat: 10.3367211,
      lng: 106.3687357
    }
  },
  videoGuide: {
    heading: "VIDEO HƯỚNG DẪN ĐƯỜNG ĐI",
    description: "Xem video để biết cách di chuyển đến Cồn Phụng dễ dàng nhất từ TP.HCM và các tỉnh lân cận",
    videos: [
      {
        title: "ĐƯỜNG ĐI BẰNG XE MÁY",
        url: "https://www.youtube.com/watch?v=vY-V3gww26c",
        thumbnail: "https://i.ytimg.com/vi_webp/vY-V3gww26c/sddefault.webp",
        duration: "5:30"
      },
      {
        title: "ĐƯỜNG ĐI BẰNG Ô TÔ",
        url: "https://www.youtube.com/watch?v=dYaBm4ca5Y0",
        thumbnail: "https://i.ytimg.com/vi_webp/dYaBm4ca5Y0/maxresdefault.webp",
        duration: "8:45"
      }
    ]
  },
  ctaBooking: {
    heading: "NHANH TAY ĐẶT CHỖ - SỐ LƯỢNG CÓ HẠN",
    description: "Đặt tour ngay hôm nay để nhận ưu đãi tốt nhất và đảm bảo chỗ cho nhóm của bạn",
    ctaText: "☎️ Đặt Tour Ngay",
    ctaLink: "tel:+84918267715",
    phone: "+84918 267 715",
    features: [
      "✅ Giá tốt nhất - Chính chủ",
      "✅ Hỗ trợ 24/7",
      "✅ Đảm bảo chất lượng"
    ]
  },
  restaurant: {
    eyebrow: "Nhà Hàng",
    title: "NHÀ HÀNG KHU DU LỊCH CỒN PHỤNG",
    description: "Nhà hàng KDL Cồn Phụng Bến Tre với nhiều khu riêng biệt, cạnh bờ sông, rộng rãi, thoáng mát. Chuyên tổ chức tiệc, gala, hội nghị với hệ thống âm thanh, sân khấu, màn hình LED hiện đại.",
    capacity: "2,000+ khách",
    specialties: [
      "Cá tai tượng chiên xù",
      "Bánh xèo củ hủ dừa",
      "Cá lóc nướng trui",
      "Gà quay",
      "Xôi phồng",
      "Các loại lẩu chua miền tây",
      "Lẩu mắm"
    ],
    image: "/uploads/2024/12/nhahangconphung.conphungtourist.com.webp",
    isActive: true
  },
  faq: {
    heading: "CÂU HỎI THƯỜNG GẶP",
    items: [
      {
        question: 'Giá tour Cồn Phụng bao nhiêu?',
        answer: 'Giá tour dao động từ 500.000đ - 1.500.000đ tùy theo số người và dịch vụ đi kèm. Chúng tôi có nhiều gói tour phù hợp với mọi nhu cầu từ tham quan ngắn ngày đến trải nghiệm đầy đủ.'
      },
      {
        question: 'Tour có bao gồm ăn uống không?',
        answer: 'Có, tour bao gồm bữa trưa với các món đặc sản miền Tây như lẩu mắm, gỏi cuốn, bánh xèo, và nhiều món ngon khác. Tất cả đều tươi ngon và được chế biến vệ sinh.'
      },
      {
        question: 'Có dịch vụ đón tiễn không?',
        answer: 'Có, chúng tôi cung cấp dịch vụ đưa đón tận nơi tại TP.HCM và các tỉnh lân cận. Vui lòng liên hệ trước để được hỗ trợ tốt nhất.'
      },
      {
        question: 'Thời gian hoạt động của khu du lịch?',
        answer: 'Khu du lịch Cồn Phụng mở cửa từ 7:00 - 18:00 hàng ngày, kể cả ngày lễ tết. Thời gian tham quan lý tưởng nhất là từ 8:00 - 16:00.'
      },
      {
        question: 'Có chỗ nghỉ tại Cồn Phụng không?',
        answer: 'Có, chúng tôi có homestay Coco Island với nhiều phòng tiện nghi hiện đại, view sông đẹp, phù hợp cho gia đình và nhóm bạn. Giá từ 500.000đ/phòng/đêm.'
      },
      {
        question: 'Tour có phù hợp với trẻ em không?',
        answer: 'Rất phù hợp! Các hoạt động tại Cồn Phụng an toàn, thú vị cho mọi lứa tuổi. Trẻ em dưới 1m có tour miễn phí, từ 1m - 1m3 được giảm 50%.'
      }
    ],
    isActive: true
  },
  homestay: {
    eyebrow: 'Lưu Trú',
    heading: 'LƯU TRÚ HOMESTAY SINH THÁI',
    subheading: 'COCO ISLAND CỒN PHỤNG',
    description: '🌿 Nghỉ dưỡng giữa thiên nhiên - Trải nghiệm homestay xanh mát',
    amenities: [
      { icon: 'Leaf', label: 'Sinh Thái' },
      { icon: 'Wifi', label: 'Wifi Free' },
      { icon: 'Coffee', label: 'Ăn Sáng' },
      { icon: 'Bed', label: 'Tiện Nghi' },
      { icon: 'Star', label: 'Chất Lượng' },
    ],
    highlights: [
      { icon: 'Leaf', title: 'Không Gian Xanh', description: 'Giữa rừng dừa, gần sông nước, thoáng mát' },
      { icon: 'Home', title: 'Phòng Hiện Đại', description: 'Đầy đủ tiện nghi, sạch sẽ, thoải mái' },
      { icon: 'Star', title: 'Dịch Vụ Tốt', description: 'Phục vụ tận tình, chu đáo 24/7' },
    ],
    bottomNote: '💡 Đặt phòng sớm để nhận giá tốt nhất và chọn phòng đẹp',
    isActive: true,
    cocoIslandCard: {
      imageUrl: '/uploads/2024/10/coco-island-con-phung-ben-tre40-1024x768-2-768x576.webp',
      originalPrice: 800000,
      discount: 30,
      finalPrice: 560000,
      currency: '₫',
      includedItems: [
        '🚢 Vé tàu khứ hồi và vé cổng tham quan KDL Cồn Phụng',
        '☕ Phục vụ ăn sáng (Tô + ly)',
        '🎁 Check in phòng tặng kèm: trái cây + dừa tươi/khách, cafe gói + trà gói + nước suối miễn phí',
      ],
      roomAmenities: [
        '⚡ Ấm điện siêu tốc',
        '💨 Máy sấy tóc',
        '📞 Điện thoại bàn',
        '🛁 Khăn tắm',
        '👡 Dép',
        '❄️ Máy lạnh',
        '🧊 Tủ lạnh',
        '📺 Smart TV',
        '📶 Wifi miễn phí',
      ],
    },
  },
  socialProof: {
    eyebrow: 'Đánh Giá Từ Khách Hàng',
    heading: 'Khách Hàng Nói Gì Về Chúng Tôi',
    description: 'Hơn 2,000+ đánh giá 5 sao từ khách hàng đã trải nghiệm',
    overallRating: 4.8,
    ratingText: '4.8/5',
    testimonials: [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        avatar: '',
        rating: 5,
        date: '15/01/2025',
        content: 'Trải nghiệm tuyệt vời! Cảnh đẹp, nhân viên nhiệt tình, ăn uống ngon. Gia đình tôi rất hài lòng và sẽ quay lại.',
        tourType: 'Tour 1 ngày',
        verified: true,
      },
      {
        id: '2',
        name: 'Trần Thị B',
        avatar: '',
        rating: 5,
        date: '10/01/2025',
        content: 'Homestay sạch sẽ, view đẹp, giá cả hợp lý. Rất phù hợp cho gia đình có trẻ nhỏ. Sẽ giới thiệu cho bạn bè.',
        tourType: 'Homestay 2N1Đ',
        verified: true,
      },
      {
        id: '3',
        name: 'Lê Hoàng C',
        avatar: '',
        rating: 5,
        date: '05/01/2025',
        content: 'Hướng dẫn viên nhiệt tình, giải thích kỹ về văn hóa Đạo Dừa. Tour rất đáng giá, recommend mạnh!',
        tourType: 'Tour văn hóa',
        verified: true,
      },
    ],
    trustStats: [
      { value: '2,000+', label: 'Khách Hàng', icon: 'User', gradient: 'from-emerald-500 to-green-500' },
      { value: '15+', label: 'Năm Kinh Nghiệm', icon: 'Calendar', gradient: 'from-blue-500 to-cyan-500' },
      { value: '98%', label: 'Hài Lòng', icon: 'ThumbsUp', gradient: 'from-amber-500 to-orange-500' },
    ],
    bottomCTAText: '🌟 Trở thành khách hàng hài lòng tiếp theo!',
    bottomCTADescription: 'Đặt tour ngay để nhận ưu đãi tốt nhất và trải nghiệm dịch vụ 5 sao',
    isActive: true,
  },
  footer: {
    contactHeading: 'LIÊN HỆ',
    contactDescription: 'Đội ngũ chuyên nghiệp, tận tâm phục vụ quý khách',
    showTeamMembers: true,
    teamMembers: [
      {
        name: 'PHAN VĂN THÔNG',
        title: 'Tổng Giám đốc',
        imgSrc: '/uploads/2019/11/ae2a6bdd3726d1788837.webp',
        email: 'mailto:conphungthong@gmail.com',
        phone: 'tel:+84918267715',
        numberphone: '+84918267715',
      },
      {
        name: 'NGUYỄN THỊ THU CÚC',
        title: 'PHÓ Tổng Giám đốc',
        imgSrc: '/uploads/2019/11/z1610510565264_55d0e3d6652f95a4da7a65f5a9ef32b51.webp',
        email: 'mailto:conphung87@yahoo.com.vn',
        phone: 'tel:+84914702958',
        numberphone: '+84914702958',
      },
      {
        name: 'Võ Thị Yến Linh',
        title: 'Trưởng phòng TC HC TV',
        imgSrc: '/uploads/2019/11/z1610530448205_d970273f4223da879cddaccf6db079921.webp',
        email: 'mailto:ketoanconphung@gmail.com',
        phone: 'tel:+84948846668',
        numberphone: '+84948846668',
      },
      {
        name: 'Võ Thị Kim Cương',
        title: 'Trưởng phòng điều hành du lịch',
        imgSrc: '/uploads/2019/10/dieu-hanh-du-lich-con-phung-vo-thi-kim-cuong.webp',
        email: 'mailto:conphungtourist87@gmail.com',
        phone: 'tel:+84917645039',
        numberphone: '+84917645039',
      },
      {
        name: 'Nguyễn Thị Ngọc Nhiên',
        title: 'Trưởng phòng Marketing',
        imgSrc: '/uploads/2019/10/ngoc-nhien-phong-kinh-doanh-con-phung.webp',
        email: 'mailto:ngocnhienconphungbentre@gmail.com',
        phone: 'tel:+84948416066',
        numberphone: '+84948416066',
      },
    ],
    companyDescription: 'Khám phá vẻ đẹp thiên nhiên và văn hóa độc đáo của miền Tây tại Khu Du Lịch Cồn Phụng - Công trình kiến trúc Đạo Dừa nổi tiếng.',
    socialLinks: [
      { icon: 'Facebook', href: 'https://facebook.com/conphung', label: 'Facebook', color: 'hover:bg-blue-600' },
      { icon: 'Instagram', href: 'https://instagram.com/conphung', label: 'Instagram', color: 'hover:bg-pink-600' },
      { icon: 'Youtube', href: 'https://youtube.com/@conphung', label: 'Youtube', color: 'hover:bg-red-600' },
      { icon: 'MessageCircle', href: 'https://zalo.me/0918267715', label: 'Zalo', color: 'hover:bg-blue-500' },
    ],
    linkGroups: [
      {
        title: 'Công ty',
        links: [
          { label: 'Giới thiệu', href: '/gioi-thieu' },
          { label: 'Liên hệ', href: '/lien-he' },
          { label: 'Tuyển dụng', href: '/tuyen-dung' },
          { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
        ],
      },
      {
        title: 'Dịch vụ',
        links: [
          { label: 'Tour du lịch', href: '/tours' },
          { label: 'Homestay', href: '/homestays' },
          { label: 'Nhà hàng', href: '/nha-hang' },
          { label: 'Sự kiện', href: '/su-kien' },
        ],
      },
    ],
    contactInfo: [
      { icon: 'Phone', label: 'Hotline', value: '0918 267 715', href: 'tel:+84918267715' },
      { icon: 'Mail', label: 'Email', value: 'conphung87@yahoo.com.vn', href: 'mailto:conphung87@yahoo.com.vn' },
      { icon: 'MapPin', label: 'Địa chỉ', value: 'Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long', href: 'https://maps.google.com/?q=10.3367211,106.3687357' },
      { icon: 'Clock', label: 'Giờ làm việc', value: 'Thứ 2 - CN: 7:00 - 18:00' },
    ],
    newsletterTitle: 'Đăng ký nhận tin',
    newsletterEnabled: true,
    companyName: 'CÔNG TY TNHH DU LỊCH DỊCH VỤ THƯƠNG MẠI CỒN PHỤNG',
    taxCode: '1300390306',
    businessLicense: 'GIẤY PHÉP KINH DOANH DỊCH VỤ LỮ HÀNH QUỐC TẾ - Số GP/No. : 83-005/2019 /TCDL-GP LHQT',
    foodSafetyCert: 'GIẤY CHỨNG NHẬN CƠ SỞ ĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM SỐ: 71/2021./ATTP-CNĐK',
    bankAccount: 'Số tài khoản: 7210783403 - BIDV chi nhánh Bến Tre',
    address: 'Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long',
    copyrightText: `© ${new Date().getFullYear()} Khu Du Lịch Cồn Phụng. Bảo lưu mọi quyền.`,
    isActive: true,
  },
};

export async function getHomepageConfig(): Promise<HomepageConfig> {
  try {
    // Priority 1: Load from HomepageSettings.sections (PUBLISHED) - from homepage-settings
    const publishedSettings = await prisma.homepageSettings.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' },
    });

    // In development mode, if no PUBLISHED, check for DRAFT (for testing)
    const draftSettings = process.env.NODE_ENV === 'development' && !publishedSettings
      ? await prisma.homepageSettings.findFirst({
          where: { status: 'DRAFT' },
          orderBy: { updatedAt: 'desc' },
        })
      : null;

    const activeSettings = publishedSettings || draftSettings;

    if (activeSettings?.sections && typeof activeSettings.sections === 'object') {
      const dbSections = activeSettings.sections as any;
      
      // Deep merge for tourPricing to preserve styles
      const mergedConfig = {
        ...DEFAULT_CONFIG,
        ...dbSections,
      };
      
      // Deep merge tourPricing if it exists in database
      if (dbSections.tourPricing && DEFAULT_CONFIG.tourPricing) {
        // Use database styles directly if they exist, otherwise use default
        const mergedStyles = dbSections.tourPricing.styles && typeof dbSections.tourPricing.styles === 'object'
          ? dbSections.tourPricing.styles  // Use database styles directly - they are complete
          : (DEFAULT_CONFIG.tourPricing.styles || {});
        
        mergedConfig.tourPricing = {
          ...DEFAULT_CONFIG.tourPricing,
          ...dbSections.tourPricing,
          styles: mergedStyles,  // Use merged styles
          // Preserve tours array from database if it exists
          tours: dbSections.tourPricing.tours || DEFAULT_CONFIG.tourPricing.tours,
        };
        
        // Debug log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('[getHomepageConfig] TourPricing merge:', {
            hasDbStyles: !!dbSections.tourPricing.styles,
            hasHeadingStyles: !!dbSections.tourPricing.styles?.heading,
            headingFontSize: dbSections.tourPricing.styles?.heading?.typography?.fontSize,
            mergedHeadingFontSize: mergedConfig.tourPricing.styles?.heading?.typography?.fontSize,
            mergedStylesKeys: Object.keys(mergedStyles),
          });
        }
      }

      // Deep merge homestay if it exists in database
      if (dbSections.homestay && DEFAULT_CONFIG.homestay) {
        // Deep merge cocoIslandCard to preserve nested properties like includedItems
        const mergedCocoIslandCard = dbSections.homestay.cocoIslandCard 
          ? {
              ...DEFAULT_CONFIG.homestay.cocoIslandCard,
              ...dbSections.homestay.cocoIslandCard,
              // Deep merge arrays to preserve items from database
              includedItems: dbSections.homestay.cocoIslandCard.includedItems || DEFAULT_CONFIG.homestay.cocoIslandCard?.includedItems || [],
              roomAmenities: dbSections.homestay.cocoIslandCard.roomAmenities || DEFAULT_CONFIG.homestay.cocoIslandCard?.roomAmenities || [],
            }
          : DEFAULT_CONFIG.homestay.cocoIslandCard;
        
        mergedConfig.homestay = {
          ...DEFAULT_CONFIG.homestay,
          ...dbSections.homestay,
          cocoIslandCard: mergedCocoIslandCard,
        };
      }

      // Deep merge gallery if it exists in database
      if (dbSections.gallery && DEFAULT_CONFIG.gallery) {
        mergedConfig.gallery = {
          ...DEFAULT_CONFIG.gallery,
          ...dbSections.gallery,
          // Preserve ecoFeatures from database if exists, otherwise use default
          ecoFeatures: dbSections.gallery.ecoFeatures && dbSections.gallery.ecoFeatures.length === 3
            ? dbSections.gallery.ecoFeatures
            : (DEFAULT_CONFIG.gallery.ecoFeatures || []),
          // Preserve bottomText from database if exists, otherwise use default
          bottomText: dbSections.gallery.bottomText || DEFAULT_CONFIG.gallery.bottomText,
          // Preserve images array from database if exists, otherwise use default
          images: dbSections.gallery.images && dbSections.gallery.images.length > 0
            ? dbSections.gallery.images
            : (DEFAULT_CONFIG.gallery.images || []),
        };
      }

      // Deep merge policyLinks if it exists in database
      if (dbSections.policyLinks && DEFAULT_CONFIG.policyLinks) {
        mergedConfig.policyLinks = {
          ...DEFAULT_CONFIG.policyLinks,
          ...dbSections.policyLinks,
          // Preserve title, subtitle, bottomText from database if exists, otherwise use default
          title: dbSections.policyLinks.title || DEFAULT_CONFIG.policyLinks.title,
          subtitle: dbSections.policyLinks.subtitle || DEFAULT_CONFIG.policyLinks.subtitle,
          bottomText: dbSections.policyLinks.bottomText || DEFAULT_CONFIG.policyLinks.bottomText,
          // Preserve links array from database if exists, otherwise use default
          links: dbSections.policyLinks.links && dbSections.policyLinks.links.length > 0
            ? dbSections.policyLinks.links
            : (DEFAULT_CONFIG.policyLinks.links || []),
        };
      }
      
      return mergedConfig;
    }

    // Priority 2: Load from HomepageSection (old CMS)
    const sections = await prisma.homepageSection.findMany({
      orderBy: { order: 'asc' },
    });

    if (sections.length === 0) {
      return DEFAULT_CONFIG;
    }

    const config: Partial<HomepageConfig> = {};

    for (const section of sections) {
      try {
        if (section.content) {
          // @ts-ignore
          config[section.sectionKey as keyof HomepageConfig] = section.content;
        }
      } catch (error) {
        console.error(`Error parsing section ${section.sectionKey}:`, error);
      }
    }

    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    console.error('Error fetching homepage config:', error);
    return DEFAULT_CONFIG;
  }
}

export async function saveHomepageConfig(
  config: HomepageConfig,
  options?: { updatedById?: string }
): Promise<HomepageConfig> {
  try {
    // Validate config
    homepageConfigSchema.parse(config);

    // Save each section
    const promises = Object.entries(config).map(async ([sectionKey, value], index) => {
      const existing = await prisma.homepageSection.findUnique({
        where: { sectionKey },
      });

      if (existing) {
        return prisma.homepageSection.update({
          where: { sectionKey },
          data: {
            content: value as any,
            updatedAt: new Date(),
          },
        });
      } else {
        return prisma.homepageSection.create({
          data: {
            id: `homepage_${sectionKey}_${Date.now()}`,
            sectionKey,
            content: value as any,
            order: index,
            updatedAt: new Date(),
          },
        });
      }
    });

    await Promise.all(promises);

    return config;
  } catch (error) {
    console.error('Error saving homepage config:', error);
    throw new Error('Failed to save configuration');
  }
}

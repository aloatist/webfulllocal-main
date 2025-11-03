import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { homepageConfigSchema } from '@/lib/homepage/schema';

// Import sample data from homepage components
const SAMPLE_CONFIG = {
  hero: {
    mainTitle: 'KHU DU LỊCH SINH THÁI CỒN PHỤNG BẾN TRE',
    subtitle: 'Công Trình Kiến Trúc Đạo Dừa',
    description: '🌿 Du lịch sinh thái - Trải nghiệm thiên nhiên và văn hóa miền Tây. Đặt tour chính chủ để nhận ưu đãi tốt nhất!',
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
  },
  promotion: {
    eyebrow: 'Ưu đãi đặc biệt',
    heading: '🎉 GIẢM GIÁ 30% CHO TẤT CẢ CÁC GÓI TOUR',
    description: 'Đặt tour trước 7 ngày để nhận ưu đãi tốt nhất. Áp dụng cho nhóm từ 10 người. Số lượng có hạn!',
    imageUrl: '/uploads/combo-3-con-phung-768x768.webp',
    discount: '30%',
    isActive: true,
  },
  ticket: {
    eyebrow: 'Vé tham quan',
    heading: 'VÉ CỔNG CHÍNH CHỦ KHU DU LỊCH CỒN PHỤNG',
    subheading: 'Giá vé ưu đãi - Trực tiếp chính chủ',
    description: 'Vé đã bao gồm tàu khứ hồi và tham quan các điểm trong khu du lịch',
    prices: {
      adult: 50000,
      child: 30000,
      currency: '₫',
    },
    includedItems: [
      '🚢 Miễn phí vé tàu khứ hồi',
      '🐊 Tham quan trại nuôi cá sấu',
      '🍬 Tham quan sản xuất kẹo Dừa',
      '🎨 Thủ công mỹ nghệ từ Dừa',
      '🏛️ Tham quan di tích Đạo Dừa',
      '🥥 Bảo tàng Dừa',
    ],
    pickupLocation: 'Bến phà Rạch Miễu cũ, xã Tân Thạch, huyện Châu Thành, tỉnh Bến Tre',
    warningNote: 'Đến bến phà, vui lòng gọi Hotline để được hỗ trợ tàu đón, tránh nhầm lẫn không phải chính chủ',
    imageUrl: '/uploads/ve-cong.jpg',
  },
  tourPricing: {
    eyebrow: 'Tour khám phá',
    heading: 'TOUR KHÁM PHÁ TRONG NGÀY CỒN THỚI SƠN – CỒN PHỤNG',
    description: 'Trải nghiệm đầy đủ văn hóa miền Tây với giá ưu đãi',
    tours: [
      {
        id: 'tour-1',
        name: 'Tour Cồn Thới Sơn - Cồn Phụng',
        description: 'Tour khám phá đầy đủ 2 cồn nổi tiếng nhất miền Tây',
        originalPrice: 600000,
        discount: 0,
        finalPrice: 600000,
        currency: '₫',
        imageUrl: '/uploads/tour-thumbnail.jpg',
        duration: '1 ngày',
        isActive: true,
        order: 1,
        includedItems: [
          '🚢 Vé tàu khứ hồi',
          '🎭 Nghe Đờn ca tài tử Nam Bộ',
          '🥥 Thưởng thức trái cây theo mùa',
          '🛶 Đi xuồng ba lá trong rạch dừa',
          '👨‍🏫 Hướng dẫn viên địa phương',
        ],
      },
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
  gallery: {
    heading: 'MỘT SỐ HÌNH ẢNH',
    description: 'Khám phá vẻ đẹp thiên nhiên và văn hóa độc đáo của Cồn Phụng',
    images: [
      { url: '/uploads/gallery-1.jpg', alt: 'Cồn Phụng - Vườn dừa xanh mát' },
      { url: '/uploads/gallery-2.jpg', alt: 'Công trình kiến trúc Đạo Dừa' },
      { url: '/uploads/gallery-3.jpg', alt: 'Rạch dừa thơ mộng' },
      { url: '/uploads/gallery-4.jpg', alt: 'Trải nghiệm văn hóa miền Tây' },
    ],
  },
  map: {
    heading: 'ĐƯỜNG ĐẾN CỒN PHỤNG',
    description: 'Hướng dẫn chi tiết cách di chuyển đến khu du lịch Cồn Phụng',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.123456789!2d106.3687357!3d10.3367211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIwJzEyLjIiTiAxMDbCsDIyJzA3LjQiRQ!5e0!3m2!1svi!2s!4v1234567890',
    address: 'Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long',
    coordinates: {
      lat: 10.3367211,
      lng: 106.3687357,
    },
  },
  videoGuide: {
    heading: 'Video Hướng Dẫn',
    description: 'Xem video để hiểu rõ hơn về khu du lịch Cồn Phụng',
    videos: [
      {
        title: 'Giới thiệu Cồn Phụng',
        url: 'https://www.youtube.com/watch?v=example',
        thumbnail: '/uploads/video-thumbnail.jpg',
        duration: '5:30',
      },
    ],
  },
  ctaBooking: {
    heading: 'Nhanh tay đặt chỗ ngay!',
    description: 'Liên hệ với chúng tôi để đặt tour và homestay với giá ưu đãi nhất',
    ctaText: '☎️ Đặt ngay',
    ctaLink: 'tel:+84918267715',
    phone: '+84918267715',
    features: [
      '✅ Giá ưu đãi chính chủ',
      '✅ Hỗ trợ 24/7',
      '✅ Đặt tour nhanh chóng',
      '✅ Thanh toán linh hoạt',
    ],
  },
  restaurant: {
    title: 'NHÀ HÀNG KHU DU LỊCH CỒN PHỤNG',
    description: 'Nhà hàng KDL Cồn Phụng Bến Tre với nhiều khu riêng biệt, cạnh bờ sông, rộng rãi, thoáng mát. Chuyên tổ chức tiệc, gala, hội nghị với hệ thống âm thanh, sân khấu, màn hình LED hiện đại.',
    capacity: '2,000+ khách',
    specialties: [
      'Cá tai tượng chiên xù',
      'Bánh xèo củ hủ dừa',
      'Cá lóc nướng trui',
      'Gà quay',
      'Xôi phồng',
      'Các loại lẩu chua miền tây',
      'Lẩu mắm',
    ],
    image: '/uploads/2024/12/nhahangconphung.conphungtourist.com.webp',
    isActive: true,
  },
  faq: {
    heading: 'Câu hỏi thường gặp',
    items: [
      {
        question: 'Giá tour Cồn Phụng bao nhiêu?',
        answer: 'Giá tour dao động từ 500.000đ - 1.500.000đ tùy theo số người và dịch vụ đi kèm. Chúng tôi có nhiều gói tour phù hợp với mọi nhu cầu từ tham quan ngắn ngày đến trải nghiệm đầy đủ.',
      },
      {
        question: 'Tour có bao gồm ăn uống không?',
        answer: 'Có, tour bao gồm bữa trưa với các món đặc sản miền Tây như lẩu mắm, gỏi cuốn, bánh xèo, và nhiều món ngon khác. Tất cả đều tươi ngon và được chế biến vệ sinh.',
      },
      {
        question: 'Có dịch vụ đón tiễn không?',
        answer: 'Có, chúng tôi cung cấp dịch vụ đưa đón tận nơi tại TP.HCM và các tỉnh lân cận. Vui lòng liên hệ trước để được hỗ trợ tốt nhất.',
      },
      {
        question: 'Thời gian hoạt động của khu du lịch?',
        answer: 'Khu du lịch Cồn Phụng mở cửa từ 7:00 - 18:00 hàng ngày, kể cả ngày lễ tết. Thời gian tham quan lý tưởng nhất là từ 8:00 - 16:00.',
      },
      {
        question: 'Có chỗ nghỉ tại Cồn Phụng không?',
        answer: 'Có, chúng tôi có homestay Coco Island với nhiều phòng tiện nghi hiện đại, view sông đẹp, phù hợp cho gia đình và nhóm bạn. Giá từ 500.000đ/phòng/đêm.',
      },
      {
        question: 'Tour có phù hợp với trẻ em không?',
        answer: 'Rất phù hợp! Các hoạt động tại Cồn Phụng an toàn, thú vị cho mọi lứa tuổi. Trẻ em dưới 1m có tour miễn phí, từ 1m - 1m3 được giảm 50%.',
      },
    ],
    isActive: true,
  },
  about: {
    title: 'THÔNG TIN VỀ CHÚNG TÔI',
    content: JSON.stringify({
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Khu du lịch sinh thái Cồn Phụng là điểm đến lý tưởng cho du khách muốn khám phá văn hóa và thiên nhiên miền Tây Nam Bộ. Với công trình kiến trúc Đạo Dừa độc đáo, chúng tôi mang đến những trải nghiệm đáng nhớ.',
          },
        },
      ],
      version: '2.28.1',
    }),
    image: '/uploads/anhbiadulichconphung.webp',
    isActive: true,
  },
};

const SAMPLE_SEO = {
  metaTitle: 'Khu Du Lịch Cồn Phụng | Tour Miền Tây Bến Tre',
  metaDescription: 'Khám phá Khu Du Lịch Cồn Phụng với công trình kiến trúc Đạo Dừa độc đáo. Tour miền Tây, homestay, ẩm thực đặc sắc. Đặt tour ngay!',
  metaKeywords: ['du lịch miền tây', 'tour cồn phụng', 'homestay', 'ẩm thực', 'bến tre', 'đạo dừa'],
  canonicalUrl: 'https://conphungtourist.com/',
  robotsMeta: 'index, follow',
};

// POST - Import sample data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Validate config
    const validatedConfig = homepageConfigSchema.parse(SAMPLE_CONFIG);

    // Create or update HomepageSettings
    const existing = await prisma.homepageSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      await prisma.homepageSettings.update({
        where: { id: existing.id },
        data: {
          sections: validatedConfig as any,
          status: 'DRAFT',
          updatedBy: session.user.id,
          version: existing.version + 1,
        },
      });
    } else {
      await prisma.homepageSettings.create({
        data: {
          sections: validatedConfig as any,
          status: 'DRAFT',
          updatedBy: session.user.id,
          version: 1,
        },
      });
    }

    // Create or update SEO
    const existingSEO = await prisma.homepageSEO.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existingSEO) {
      await prisma.homepageSEO.update({
        where: { id: existingSEO.id },
        data: SAMPLE_SEO,
      });
    } else {
      await prisma.homepageSEO.create({
        data: SAMPLE_SEO,
      });
    }

    // Also save to HomepageSection (backward compatibility)
    const { saveHomepageConfig } = await import('@/lib/homepage/sections');
    await saveHomepageConfig(validatedConfig, {
      updatedById: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Đã tải dữ liệu mẫu thành công!',
    });
  } catch (error: any) {
    console.error('Error importing sample data:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to import sample data' },
      { status: 500 }
    );
  }
}


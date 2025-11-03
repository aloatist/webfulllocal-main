import { prisma } from '@/lib/prisma';
import { homepageConfigSchema, type HomepageConfig } from './schema';

export const DEFAULT_CONFIG: HomepageConfig = {
  hero: {
    mainTitle: 'KHU DU LỊCH SINH THÁI CỒN PHỤNG',
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
};

export async function getHomepageConfig(): Promise<HomepageConfig> {
  try {
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

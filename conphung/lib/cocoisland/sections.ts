import { prisma } from '@/lib/prisma';
import { cocoIslandConfigSchema, type CocoIslandConfig } from './schema';
import {
  heroContent,
  stayPerks,
  experiences,
  restaurantSection,
  discoverySection,
  testimonials,
  services,
  contactInfo,
  newsletterContent,
} from './data';

const DEFAULT_CONFIG: CocoIslandConfig = {
  hero: {
    ...heroContent,
    video: {
      ...heroContent.video,
      overlayTitle: 'Video trải nghiệm Coco Island',
      overlaySubtitle: 'Cồn Phụng nhìn từ trên cao',
    },
  },
  stayPerks: {
    ...stayPerks,
    eyebrow: 'Ở lại',
    description: 'Mỗi du khách lưu trú tại Coco Island đều được chăm chút từ bữa sáng đậm chất miền Tây cho đến những món quà nhỏ xinh mang về.',
    ctaText: 'Xem toàn bộ phòng',
    ctaHref: '#rooms',
  },
  roomShowcase: {
    eyebrow: 'Phòng nghỉ',
    heading: 'Lựa chọn phòng tại Coco Island',
    description: 'Các bungalow gỗ nhìn thẳng ra sông, nội thất ấm cúng, phù hợp cho cặp đôi, gia đình và nhóm bạn muốn tận hưởng không khí miệt vườn.',
    ctaText: 'Liên hệ đặt phòng',
    ctaHref: '#booking',
  },
  experiences: {
    eyebrow: 'Trải nghiệm',
    heading: 'Coco Island chính chủ – điểm đến chuẩn miền Tây',
    description: 'Hành trình tái tạo năng lượng của bạn bắt đầu từ khoảnh khắc bước chân lên bến tàu. Ở Coco Island, mọi trải nghiệm đều được chính chủ chăm chút để giữ trọn bản sắc Cồn Phụng.',
    experiences: experiences,
  },
  restaurant: {
    ...restaurantSection,
    features: [
      'Thực đơn đặc sản miền Tây',
      'Không gian ven sông thoáng mát',
      'Đặt tiệc gia đình & doanh nghiệp',
      'Phục vụ theo nhu cầu 24/7',
    ],
  },
  discovery: discoverySection,
  testimonials: {
    eyebrow: 'Khách hàng nói gì',
    heading: 'Những lời yêu thương dành cho Coco Island',
    testimonials: testimonials,
  },
  services: {
    eyebrow: 'Dịch vụ',
    heading: 'Những tiện ích khi đồng hành cùng Coco Island',
    services: services,
  },
  contact: {
    ...contactInfo,
    eyebrow: 'Liên hệ',
    description: 'Đội ngũ tư vấn của Coco Island sẵn sàng hỗ trợ 24/7 để giúp bạn chọn phòng, lên lịch trình và đặt combo trải nghiệm phù hợp.',
    formHeading: 'Gửi yêu cầu tư vấn',
    formDescription: 'Điền thông tin để nhận báo giá chi tiết cho chuyến đi của bạn. Chúng tôi sẽ liên hệ trong vòng 30 phút.',
  },
  newsletter: newsletterContent,
};

export async function getCocoIslandConfig(): Promise<CocoIslandConfig> {
  try {
    const sections = await prisma.cocoIslandSection.findMany({
      orderBy: { key: 'asc' },
    });

    if (sections.length === 0) {
      // Return default config if no sections exist
      return DEFAULT_CONFIG;
    }

    const config: Partial<CocoIslandConfig> = {};

    for (const section of sections) {
      try {
        config[section.key as keyof CocoIslandConfig] = JSON.parse(section.data as string);
      } catch (error) {
        console.error(`Error parsing section ${section.key}:`, error);
      }
    }

    // Merge with defaults for missing sections
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    console.error('Error fetching Coco Island config:', error);
    return DEFAULT_CONFIG;
  }
}

export async function saveCocoIslandConfig(
  config: CocoIslandConfig,
  options?: { updatedById?: string }
): Promise<CocoIslandConfig> {
  try {
    // Validate config
    cocoIslandConfigSchema.parse(config);

    // Save each section
    const promises = Object.entries(config).map(async ([key, value]) => {
      const existing = await prisma.cocoIslandSection.findUnique({
        where: { key },
      });

      if (existing) {
        return prisma.cocoIslandSection.update({
          where: { key },
          data: {
            data: JSON.stringify(value),
            updatedById: options?.updatedById,
          },
        });
      } else {
        return prisma.cocoIslandSection.create({
          data: {
            id: `coco_${key}_${Date.now()}`,
            key,
            data: JSON.stringify(value),
            updatedAt: new Date(),
          },
        });
      }
    });

    await Promise.all(promises);

    return config;
  } catch (error) {
    console.error('Error saving Coco Island config:', error);
    throw new Error('Failed to save configuration');
  }
}

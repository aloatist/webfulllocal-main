import { prisma } from '@/lib/prisma';
import { cocoIslandConfigSchema, type CocoIslandConfig } from './schema';

const DEFAULT_CONFIG: CocoIslandConfig = {
  hero: {
    title: 'Coco Island Homestay',
    subtitle: 'Trải nghiệm nghỉ dưỡng tuyệt vời tại Cồn Phụng',
    backgroundImage: 'https://cocoisland.vn/wp-content/uploads/2023/01/coco-island-con-phung-ben-tre3.jpg',
    ctaText: 'Đặt phòng ngay',
    ctaLink: '/cocoisland',
  },
  about: {
    title: 'Về Coco Island',
    content: 'Coco Island là homestay nghỉ dưỡng cao cấp tại Cồn Phụng, Bến Tre...',
    images: [
      'https://cocoisland.vn/wp-content/uploads/2023/01/coco-island-con-phung-ben-tre3.jpg',
      'https://cocoisland.vn/wp-content/uploads/2023/01/coco-island-con-phung-ben-tre12.jpg',
    ],
  },
  rooms: {
    title: 'Phòng nghỉ',
    subtitle: 'Chọn phòng phù hợp với nhu cầu của bạn',
  },
  services: [
    {
      title: 'Nhà hàng',
      description: 'Thưởng thức ẩm thực miền Tây',
      icon: '🍽️',
      image: 'https://cocoisland.vn/wp-content/uploads/2021/06/coco-island-con-phung-ben-tre20.jpg',
    },
    {
      title: 'Khu vui chơi',
      description: 'Vui chơi giải trí cho mọi lứa tuổi',
      icon: '🎮',
      image: 'https://cocoisland.vn/wp-content/uploads/2021/06/coco-island-con-phung-ben-tre13.jpg',
    },
  ],
  contact: {
    title: 'Liên hệ',
    address: 'Cồn Phụng, Bến Tre, Việt Nam',
    phone: '+84 917 645 039',
    email: 'info@cocoisland.vn',
    mapUrl: 'https://maps.google.com/?q=Cồn+Phụng+Bến+Tre',
  },
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
      return prisma.cocoIslandSection.upsert({
        where: { key },
        update: {
          data: JSON.stringify(value),
          updatedById: options?.updatedById,
        },
        create: {
          key,
          data: JSON.stringify(value),
          updatedById: options?.updatedById,
        },
      });
    });

    await Promise.all(promises);

    return config;
  } catch (error) {
    console.error('Error saving Coco Island config:', error);
    throw new Error('Failed to save configuration');
  }
}

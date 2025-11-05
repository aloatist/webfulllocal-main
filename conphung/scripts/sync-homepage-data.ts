/**
 * Script để đồng bộ dữ liệu từ DEFAULT_CONFIG vào database
 * Chạy: npx tsx scripts/sync-homepage-data.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncHomepageData() {
  try {
    // Import DEFAULT_CONFIG
    const { DEFAULT_CONFIG } = await import('../lib/homepage/sections');

    console.log('🔄 Bắt đầu đồng bộ dữ liệu homepage...');

    // Sync từng section
    const sections = Object.entries(DEFAULT_CONFIG);
    
    for (const [sectionKey, content] of sections) {
      try {
        const existing = await prisma.homepageSection.findUnique({
          where: { sectionKey },
        });

        if (existing) {
          await prisma.homepageSection.update({
            where: { sectionKey },
            data: {
              content: content as any,
              updatedAt: new Date(),
            },
          });
          console.log(`✅ Đã cập nhật: ${sectionKey}`);
        } else {
          const index = sections.findIndex(([key]) => key === sectionKey);
          await prisma.homepageSection.create({
            data: {
              id: `homepage_${sectionKey}_${Date.now()}`,
              sectionKey,
              content: content as any,
              order: index,
              updatedAt: new Date(),
            },
          });
          console.log(`✅ Đã tạo mới: ${sectionKey}`);
        }
      } catch (error) {
        console.error(`❌ Lỗi khi sync ${sectionKey}:`, error);
      }
    }

    console.log('\n✅ Hoàn thành đồng bộ dữ liệu homepage!');
    console.log('📊 Dữ liệu đã được cập nhật vào database.');
    console.log('💡 Bạn có thể kiểm tra tại: /admin/homepage-settings');
  } catch (error) {
    console.error('❌ Lỗi khi đồng bộ:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

syncHomepageData();


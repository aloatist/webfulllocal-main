import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

const SOCIAL_MEDIA_TEMPLATES = [
  // Facebook
  {
    platform: 'facebook',
    name: 'Facebook Default',
    content: `🌴 {{title}}

{{excerpt}}

👉 Đọc thêm: {{url}}

#CồnPhụng #BếnTre #DuLịchMiềnTây #ConPhungTourist`,
    isDefault: true,
    settings: {
      includeImage: true,
      includeLink: true,
      maxLength: 5000,
    },
  },
  {
    platform: 'facebook',
    name: 'Facebook with Hashtags',
    content: `{{title}}

{{excerpt}}

Chi tiết: {{url}}

#CồnPhụng #BếnTre #MiềnTây #ĐạoDừa #DuLịch #Tour #Homestay #ẨmThực`,
    isDefault: false,
    settings: {
      includeImage: true,
      includeLink: true,
      hashtags: ['CồnPhụng', 'BếnTre', 'MiềnTây', 'DuLịch'],
    },
  },
  
  // Instagram
  {
    platform: 'instagram',
    name: 'Instagram Default',
    content: `✨ {{title}}

{{excerpt}}

🔗 Link in bio để xem thêm!

#CồnPhụng #BếnTre #DuLịchViệtNam #MiềnTây #ĐạoDừa #TravelVietnam #VietnamTravel #ExploreBenTre #MekongDelta`,
    isDefault: true,
    settings: {
      includeImage: true,
      aspectRatio: '1:1',
      maxHashtags: 30,
      maxLength: 2200,
    },
  },
  {
    platform: 'instagram',
    name: 'Instagram Story',
    content: `{{title}}

#CồnPhụng #BếnTre #DuLịch`,
    isDefault: false,
    settings: {
      type: 'story',
      duration: 15,
      includeLink: true,
    },
  },
  
  // YouTube
  {
    platform: 'youtube',
    name: 'YouTube Default',
    content: `{{title}}

{{excerpt}}

---

🌴 Về Cồn Phụng Tourist:
Khu du lịch Cồn Phụng - Điểm đến sinh thái độc đáo tại Bến Tre, nơi bạn có thể trải nghiệm cuộc sống miền Tây sông nước chân thực.

📞 Liên hệ:
- Hotline: 0918 267 715
- Website: https://conphungtourist.com
- Email: conphung87@yahoo.com.vn

🏷️ Tags: #CồnPhụng #BếnTre #DuLịchMiềnTây #ĐạoDừa #MekongDelta #VietnamTravel

---

👉 Đăng ký kênh để không bỏ lỡ video mới!
👍 Like và Share nếu bạn thích video này!`,
    isDefault: true,
    settings: {
      includeVideo: true,
      category: 'Travel & Events',
      privacy: 'public',
      tags: ['Cồn Phụng', 'Bến Tre', 'Miền Tây', 'Du lịch Việt Nam', 'Đạo Dừa'],
    },
  },
  
  // Twitter/X
  {
    platform: 'twitter',
    name: 'Twitter Default',
    content: `🌴 {{title}}

{{excerpt}}

👉 {{url}}

#CồnPhụng #BếnTre #VietnamTravel #MekongDelta`,
    isDefault: true,
    settings: {
      includeImage: true,
      maxLength: 280,
      threadIfLong: true,
    },
  },
  
  // LinkedIn
  {
    platform: 'linkedin',
    name: 'LinkedIn Default',
    content: `{{title}}

{{excerpt}}

Trải nghiệm du lịch sinh thái độc đáo tại Cồn Phụng, Bến Tre - nơi hội tụ của văn hóa miền Tây sông nước và thiên nhiên hoang sơ.

Xem thêm: {{url}}

#DuLịch #Tourism #VietnamTravel #EcoTourism #SustainableTravel #MekongDelta`,
    isDefault: true,
    settings: {
      includeImage: true,
      includeLinkPreview: true,
      maxLength: 3000,
    },
  },
  
  // TikTok
  {
    platform: 'tiktok',
    name: 'TikTok Default',
    content: `{{title}} 🌴

#CồnPhụng #BếnTre #MiềnTây #DuLịch #Vietnam #Travel #FYP #Trending #ĐạoDừa`,
    isDefault: true,
    settings: {
      includeVideo: true,
      maxLength: 2200,
      duration: 60,
      coverImage: true,
      hashtags: ['CồnPhụng', 'BếnTre', 'DuLịch', 'Vietnam', 'FYP'],
    },
  },
  
  // Pinterest
  {
    platform: 'pinterest',
    name: 'Pinterest Default',
    content: `{{title}}

{{excerpt}}

Khám phá Cồn Phụng - Viên ngọc xanh giữa sông nước miền Tây!

#CồnPhụng #BếnTre #DuLịchViệtNam #MiềnTây #TravelIdeas #VietnamTravel`,
    isDefault: true,
    settings: {
      includeImage: true,
      board: 'Du lịch Việt Nam',
      linkToWebsite: true,
    },
  },
  
  // Zalo OA
  {
    platform: 'zalo',
    name: 'Zalo OA Default',
    content: `🌴 {{title}}

{{excerpt}}

👉 Xem chi tiết: {{url}}

📞 Liên hệ đặt tour:
- Hotline: 0918 267 715
- Ms Cương: 0917 645 039
- Ms Nhiên: 0948 416 066`,
    isDefault: true,
    settings: {
      includeImage: true,
      includeButton: true,
      buttonText: 'Xem chi tiết',
      buttonAction: 'open_url',
    },
  },
]

export async function seedSocialMediaTemplates() {
  console.log('📱 Seeding social media templates...')

  for (const template of SOCIAL_MEDIA_TEMPLATES) {
    const existing = await prisma.socialMediaTemplate.findFirst({
      where: {
        platform: template.platform,
        name: template.name,
      },
    })

    if (!existing) {
      await prisma.socialMediaTemplate.create({
        data: {
          id: nanoid(),
          ...template,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      console.log(`  ✅ Template created: ${template.platform} - ${template.name}`)
    } else {
      // Update content if template exists
      await prisma.socialMediaTemplate.update({
        where: { id: existing.id },
        data: {
          content: template.content,
          settings: template.settings,
          updatedAt: new Date(),
        },
      })
      console.log(`  ✅ Template updated: ${template.platform} - ${template.name}`)
    }
  }

  console.log('✅ Social media templates seeding completed!')
}

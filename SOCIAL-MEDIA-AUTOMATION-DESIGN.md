# 🚀 Hệ Thống Tự Động Đăng Bài Lên Mạng Xã Hội

## 📋 Tổng Quan

Hệ thống tự động đăng bài viết, hình ảnh, video lên các nền tảng mạng xã hội khi xuất bản bài trên website.

## 🎯 Tính Năng

### 1. **Admin Panel**
- ✅ Quản lý kết nối mạng xã hội
- ✅ Cấu hình auto-posting cho từng platform
- ✅ Xem lịch sử đăng bài
- ✅ Retry failed posts
- ✅ Preview trước khi đăng
- ✅ Schedule đăng bài

### 2. **Platforms Hỗ Trợ**
- 🔵 Facebook (Page, Group)
- 📸 Instagram (Feed, Story, Reels)
- 🎬 YouTube (Video, Shorts)
- 🐦 Twitter/X
- 💼 LinkedIn
- 📱 TikTok
- 📌 Pinterest
- 📱 Zalo (OA)

### 3. **Content Types**
- 📝 Text posts
- 🖼️ Images (single/multiple)
- 🎥 Videos
- 📊 Carousels
- 🔗 Links with preview

## 🏗️ Kiến Trúc

```
┌──────────────────────────────────────────────────────────┐
│  Admin UI (Next.js)                                      │
│  - Social Media Settings                                 │
│  - Platform Connections                                  │
│  - Post History & Analytics                              │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│  Next.js API Routes                                      │
│  - /api/social-media/platforms                           │
│  - /api/social-media/posts                               │
│  - /api/social-media/webhooks                            │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│  Database (PostgreSQL + Prisma)                          │
│  - SocialMediaPlatform                                   │
│  - SocialMediaPost                                       │
│  - SocialMediaAccount                                    │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│  n8n Workflows                                           │
│  - Post to Facebook                                      │
│  - Post to Instagram                                     │
│  - Post to YouTube                                       │
│  - Post to TikTok                                        │
│  - Post to Twitter/X                                     │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│  Social Media APIs                                       │
│  - Facebook Graph API                                    │
│  - Instagram Graph API                                   │
│  - YouTube Data API                                      │
│  - Twitter API v2                                        │
│  - LinkedIn API                                          │
│  - TikTok API                                            │
└──────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

```prisma
// Tài khoản mạng xã hội
model SocialMediaAccount {
  id          String   @id
  platform    String   // facebook, instagram, youtube, etc
  accountName String
  accountId   String
  accessToken String?  // Encrypted
  refreshToken String? // Encrypted
  expiresAt   DateTime?
  isActive    Boolean  @default(true)
  settings    Json?    // Platform-specific settings
  createdAt   DateTime @default(now())
  updatedAt   DateTime
  
  posts       SocialMediaPost[]
}

// Bài đăng lên mạng xã hội
model SocialMediaPost {
  id              String   @id
  postId          String   // ID của bài viết gốc
  accountId       String   // Social media account
  platform        String   // facebook, instagram, etc
  status          String   // pending, processing, published, failed
  scheduledAt     DateTime?
  publishedAt     DateTime?
  platformPostId  String?  // ID trên platform (để xóa, edit sau)
  platformUrl     String?  // Link đến bài đăng
  content         Json     // Nội dung đã customize cho platform
  media           Json?    // URLs của media
  error           String?
  retryCount      Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime
  
  account         SocialMediaAccount @relation(fields: [accountId], references: [id])
  Post            Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@index([postId])
  @@index([accountId])
  @@index([status])
}

// Template cho từng platform
model SocialMediaTemplate {
  id          String   @id
  platform    String
  name        String
  content     String   // Template với placeholders: {{title}}, {{excerpt}}, etc
  isDefault   Boolean  @default(false)
  settings    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime
}

// Lịch sử sync
model SocialMediaSync {
  id          String   @id
  operation   String   // post_created, post_published, post_deleted
  status      String   // success, failed, pending
  payload     Json
  response    Json?
  error       String?
  createdAt   DateTime @default(now())
}
```

## 🔧 Admin UI Components

### 1. **Social Media Settings Page**
```
/admin/social-media/
├── Dashboard
│   ├── Connected Accounts
│   ├── Recent Posts
│   └── Analytics
├── Platforms
│   ├── Connect New Platform
│   ├── Manage Connections
│   └── Platform Settings
├── Posts
│   ├── Scheduled Posts
│   ├── Published Posts
│   └── Failed Posts
└── Templates
    ├── Create Template
    └── Manage Templates
```

### 2. **Post Editor Integration**
- Toggle "Auto-post to social media"
- Select platforms
- Customize content per platform
- Schedule posting time
- Preview for each platform

## 🔄 n8n Workflows

### Workflow 1: Main Post Publisher
```
Trigger (Webhook) 
  → Validate Data
  → Get Active Platforms
  → For Each Platform:
      → Transform Content
      → Upload Media
      → Publish Post
      → Update Status
  → Send Notification
```

### Workflow 2: Scheduled Posts
```
Cron (Every 5 minutes)
  → Get Pending Scheduled Posts
  → For Each Post:
      → Check Time
      → Trigger Publisher
      → Update Status
```

### Workflow 3: Retry Failed Posts
```
Cron (Every hour)
  → Get Failed Posts (retry < 3)
  → For Each Post:
      → Retry Publishing
      → Update Retry Count
```

## 🎨 UI Features

### Post Editor Enhancement
```tsx
<div className="social-media-section">
  <h3>Auto-Post to Social Media</h3>
  
  {/* Enable/Disable */}
  <Switch 
    checked={autoPost} 
    onChange={setAutoPost}
    label="Automatically post to social media"
  />
  
  {/* Platform Selection */}
  <div className="platforms">
    {platforms.map(platform => (
      <PlatformCard
        key={platform.id}
        platform={platform}
        enabled={selectedPlatforms.includes(platform.id)}
        onToggle={() => togglePlatform(platform.id)}
        onCustomize={() => customizeContent(platform.id)}
      />
    ))}
  </div>
  
  {/* Scheduling */}
  <DateTimePicker
    label="Schedule posting time"
    value={scheduledTime}
    onChange={setScheduledTime}
  />
  
  {/* Content Preview */}
  <Tabs>
    {selectedPlatforms.map(platformId => (
      <Tab key={platformId}>
        <PlatformPreview 
          platform={platformId}
          content={getContentForPlatform(platformId)}
        />
      </Tab>
    ))}
  </Tabs>
</div>
```

### Social Media Dashboard
```tsx
<Dashboard>
  {/* Stats */}
  <Stats>
    <Stat label="Connected Platforms" value={connectedCount} />
    <Stat label="Posts This Month" value={monthlyPosts} />
    <Stat label="Success Rate" value={successRate} />
    <Stat label="Pending Posts" value={pendingCount} />
  </Stats>
  
  {/* Recent Activity */}
  <RecentPosts limit={10} />
  
  {/* Platform Status */}
  <PlatformsList />
</Dashboard>
```

## 🔐 Security & Permissions

### Role Permissions
```typescript
const PERMISSIONS = {
  // Social Media Management
  'social_media.view': ['ADMIN', 'EDITOR', 'MARKETING'],
  'social_media.connect': ['ADMIN', 'MARKETING'],
  'social_media.disconnect': ['ADMIN'],
  'social_media.post': ['ADMIN', 'EDITOR', 'MARKETING'],
  'social_media.schedule': ['ADMIN', 'EDITOR', 'MARKETING'],
  'social_media.delete': ['ADMIN'],
  'social_media.retry': ['ADMIN', 'MARKETING'],
  'social_media.analytics': ['ADMIN', 'MARKETING'],
}
```

## 📝 Implementation Checklist

### Phase 1: Database & Schema
- [ ] Add Prisma models
- [ ] Run migrations
- [ ] Seed default templates

### Phase 2: API Routes
- [ ] `/api/social-media/accounts` (CRUD)
- [ ] `/api/social-media/posts` (CRUD)
- [ ] `/api/social-media/templates` (CRUD)
- [ ] `/api/social-media/publish` (Trigger n8n)
- [ ] `/api/social-media/webhooks` (n8n callbacks)

### Phase 3: n8n Workflows
- [ ] Create base workflow template
- [ ] Facebook posting workflow
- [ ] Instagram posting workflow
- [ ] YouTube posting workflow
- [ ] Scheduled posts workflow
- [ ] Retry failed posts workflow

### Phase 4: Admin UI
- [ ] Social Media Settings Page
- [ ] Platform Connection Flow
- [ ] Post History & Analytics
- [ ] Template Management
- [ ] Post Editor Integration

### Phase 5: Testing & Optimization
- [ ] Test each platform
- [ ] Error handling
- [ ] Rate limiting
- [ ] Queue management
- [ ] Analytics tracking

## 🚀 Quick Start

```bash
# 1. Cập nhật Prisma schema
cd conphung
npx prisma migrate dev --name add_social_media

# 2. Khởi động n8n
docker-compose up -d n8n

# 3. Import workflows vào n8n
# Truy cập http://localhost:5678
# Import workflows từ /n8n/workflows/

# 4. Cấu hình environment
echo "N8N_WEBHOOK_URL=http://localhost:5678/webhook/social-media-publish" >> .env
echo "N8N_WEBHOOK_SECRET=your-secret-here" >> .env

# 5. Chạy seed
npm run db:seed
```

## 📚 Resources

- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Twitter API](https://developer.twitter.com/en/docs/twitter-api)
- [n8n Documentation](https://docs.n8n.io/)

---

**Next Steps:** Bạn muốn tôi implement phase nào trước?
1. Database Schema & Migrations
2. Admin UI Pages
3. n8n Workflows
4. API Routes

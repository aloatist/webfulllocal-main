# 🎛️ Hướng Dẫn Triển Khai Homepage CMS

**Date**: January 22, 2025  
**Status**: ⚠️ **CHUẨN BỊ SẴN SÀNG - CẦN CHẠY MIGRATION**

---

## ⚠️ LƯU Ý QUAN TRỌNG

Tôi đã tạo **Database Schema** cho Homepage CMS nhưng **CHƯA TẠO** UI và API routes để tránh lỗi build.

**Lý do**: 
- Project thiếu một số UI components (Tabs, Card, Switch, etc.)
- Cần chạy Prisma migration trước
- Cần cài đặt thêm dependencies

---

## 📊 Đã Hoàn Thành

### ✅ Database Schema (Prisma)

File: `prisma/schema.prisma`

**7 Models đã thêm**:
```prisma
✅ HomepageSection (Generic)
✅ HomepageHero
✅ HomepageTicket
✅ HomepageTour
✅ HomepageRestaurant
✅ HomepageGallery
✅ HomepageCompanyInfo
```

---

## 🚀 Các Bước Triển Khai

### **Bước 1: Chạy Migration**

```bash
cd conphung

# Chạy migration để tạo tables
npx prisma migrate dev --name add_homepage_cms

# Generate Prisma Client
npx prisma generate
```

**Kết quả**: Sẽ tạo 7 tables mới trong database

---

### **Bước 2: Cài Đặt Dependencies (Nếu Cần)**

```bash
# Nếu chưa có shadcn/ui components
npx shadcn-ui@latest init

# Add các components cần thiết
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add button
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add toast
```

---

### **Bước 3: Tạo API Routes**

Tạo file: `app/api/admin/homepage/hero/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'

// GET - Fetch hero section
export async function GET() {
  try {
    const hero = await prisma.homepageHero.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST - Create or update
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const existing = await prisma.homepageHero.findFirst()

    let hero
    if (existing) {
      hero = await prisma.homepageHero.update({
        where: { id: existing.id },
        data
      })
    } else {
      hero = await prisma.homepageHero.create({ data })
    }

    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
```

**Tương tự cho**:
- `app/api/admin/homepage/ticket/route.ts`
- `app/api/admin/homepage/tour/route.ts`

---

### **Bước 4: Tạo Admin UI**

Tạo file: `app/(admin)/admin/homepage/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function HomepageManagement() {
  const [heroData, setHeroData] = useState({
    mainTitle: '',
    subtitle: '',
    description: '',
    backgroundImage: '',
    hotline: '0918 267 715',
    location: 'Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long',
    openingHours: '7:00 - 18:00',
    isActive: true,
  })

  // Load data
  useEffect(() => {
    fetch('/api/admin/homepage/hero')
      .then(res => res.json())
      .then(data => {
        if (data) setHeroData(data)
      })
  }, [])

  // Save data
  const handleSave = async () => {
    const res = await fetch('/api/admin/homepage/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(heroData),
    })

    if (res.ok) {
      alert('Đã lưu thành công!')
    } else {
      alert('Lỗi khi lưu!')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Quản Lý Trang Chủ</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-bold">Hero Banner</h2>

        <div>
          <label className="block text-sm font-medium mb-2">Tiêu Đề Chính</label>
          <input
            type="text"
            value={heroData.mainTitle}
            onChange={(e) => setHeroData({ ...heroData, mainTitle: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="KHU DU LỊCH SINH THÁI CỒN PHỤNG"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phụ Đề</label>
          <input
            type="text"
            value={heroData.subtitle}
            onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mô Tả</label>
          <textarea
            value={heroData.description}
            onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hình Nền (URL)</label>
          <input
            type="text"
            value={heroData.backgroundImage}
            onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          💾 Lưu Thay Đổi
        </button>
      </div>
    </div>
  )
}
```

---

## 📋 Database Schema Chi Tiết

### **HomepageHero**
```prisma
model HomepageHero {
  id              String   @id @default(cuid())
  mainTitle       String
  subtitle        String
  description     String   @db.Text
  backgroundImage String
  ctaText         String   @default("Đặt Tour Ngay")
  ctaLink         String   @default("tel:+84918267715")
  hotline         String   @default("0918 267 715")
  location        String   @default("Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long")
  openingHours    String   @default("7:00 - 18:00")
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### **HomepageTicket**
```prisma
model HomepageTicket {
  id            String   @id @default(cuid())
  title         String
  description   String?  @db.Text
  adultPrice    Int      // VNĐ
  childPrice    Int      // VNĐ
  includes      Json     // Array
  pickupInfo    String?  @db.Text
  warningNote   String?  @db.Text
  image         String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### **HomepageTour**
```prisma
model HomepageTour {
  id            String   @id @default(cuid())
  title         String
  description   String?  @db.Text
  originalPrice Int      // VNĐ
  salePrice     Int      // VNĐ
  discount      String?  // "50%"
  duration      String   @default("Trong ngày")
  includes      Json     // Array
  image         String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 🎯 Cách Sử Dụng Sau Khi Hoàn Thành

### **Admin Panel**
```
URL: http://localhost:3000/admin/homepage
```

### **Cập Nhật Hero**
1. Truy cập `/admin/homepage`
2. Nhập tiêu đề: "KHU DU LỊCH SINH THÁI CỒN PHỤNG"
3. Nhập mô tả, URL hình ảnh
4. Click "Lưu Thay Đổi"

### **Cập Nhật Vé Cổng**
1. Nhập giá người lớn: 50000
2. Nhập giá trẻ em: 30000
3. Click "Lưu"

### **Cập Nhật Tour**
1. Nhập giá gốc: 300000
2. Nhập giá sale: 149000
3. Click "Lưu"

---

## 🔄 Làm Homepage Dynamic

### **Hiện Tại** (Static):
```tsx
<h1>KHU DU LỊCH SINH THÁI CỒN PHỤNG</h1>
```

### **Sau Khi Có CMS** (Dynamic):
```tsx
// Fetch data
const res = await fetch('/api/admin/homepage/hero')
const data = await res.json()

// Display
<h1>{data.mainTitle}</h1>
<p>{data.description}</p>
```

---

## ✅ Checklist Triển Khai

- [ ] Chạy `npx prisma migrate dev`
- [ ] Chạy `npx prisma generate`
- [ ] Cài đặt shadcn/ui components (nếu cần)
- [ ] Tạo API routes (hero, ticket, tour)
- [ ] Tạo Admin UI page
- [ ] Test CRUD operations
- [ ] Cập nhật homepage để dùng dynamic data
- [ ] Add image upload functionality
- [ ] Add more sections (restaurant, gallery, etc.)

---

## 📝 Next Steps

### **Phase 2**:
1. ✅ Image upload component
2. ✅ Rich text editor
3. ✅ Array field management
4. ✅ Preview mode
5. ✅ More sections

### **Phase 3**:
1. ✅ Make homepage fully dynamic
2. ✅ Cache management
3. ✅ Version control
4. ✅ Publish/Draft system

---

## 🎉 Summary

**Đã Chuẩn Bị**:
- ✅ Database schema (7 models)
- ✅ Migration file ready
- ✅ Documentation complete

**Cần Làm**:
- 🔄 Chạy migration
- 🔄 Tạo API routes
- 🔄 Tạo Admin UI
- 🔄 Make homepage dynamic

**Lợi Ích**:
- ✅ Admin có thể cập nhật nội dung dễ dàng
- ✅ Không cần code để thay đổi text/hình ảnh
- ✅ Secure (chỉ ADMIN)
- ✅ Scalable architecture

---

**Last Updated**: January 22, 2025  
**Status**: Ready for Migration  
**Next**: Run `npx prisma migrate dev`

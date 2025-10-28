# ⚡ Quick Improvements Guide

**Priority**: Critical & Quick Wins  
**Time**: 1-2 days

---

## 🚀 Quick Fixes (Can Do Now - 2-3 hours)

### 1. Fix Homepage Images (30 mins)

**Problem**: Images in LIÊN HỆ section have different sizes

**Solution**:
```tsx
// Wrap all images with consistent aspect ratio
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {contactImages.map((image) => (
    <div key={image.id} className="aspect-[4/3] relative overflow-hidden rounded-lg shadow-lg">
      <Image
        src={image.url}
        alt={image.alt}
        fill
        className="object-cover transition-transform hover:scale-110 duration-300"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  ))}
</div>
```

---

### 2. Add Basic Animations (1 hour)

**Install Framer Motion**:
```bash
npm install framer-motion
```

**Add to Homepage**:
```tsx
import { motion } from 'framer-motion'

// Fade in on scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  <YourContent />
</motion.div>

// Hover effect on cards
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="card"
>
  <Card />
</motion.div>
```

---

### 3. Improve Button Styles (30 mins)

**Add to globals.css**:
```css
/* Better button hover effects */
.btn-primary {
  @apply bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold;
  @apply transition-all duration-300;
  @apply hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5;
  @apply active:translate-y-0;
}

/* Gradient buttons */
.btn-gradient {
  @apply bg-gradient-to-r from-primary to-emerald-600;
  @apply hover:from-primary/90 hover:to-emerald-600/90;
}
```

---

### 4. Add Loading Skeletons (30 mins)

```tsx
// components/ui/skeleton.tsx already exists
import { Skeleton } from '@/components/ui/skeleton'

// Use in components
{isLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
) : (
  <ActualContent />
)}
```

---

## 🎨 Homepage Enhancements (3-4 hours)

### 1. Hero Section with Animation

```tsx
// app/page.tsx
import { motion } from 'framer-motion'

<motion.div 
  className="relative h-[420px] w-full overflow-hidden rounded-3xl shadow-2xl"
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
>
  <Image src="/hero.webp" alt="Hero" fill className="object-cover" />
  
  {/* Animated overlay */}
  <motion.div 
    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.6 }}
  />
  
  {/* Animated content */}
  <motion.div 
    className="absolute inset-0 flex flex-col justify-end p-12"
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
  >
    <h1 className="text-4xl font-bold text-white">
      Khu Du Lịch Cồn Phụng
    </h1>
    <p className="mt-4 text-lg text-white/90">
      Trải nghiệm thiên nhiên miền Tây
    </p>
  </motion.div>
</motion.div>
```

---

### 2. Card Grid with Stagger Animation

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.div 
  className="grid grid-cols-1 md:grid-cols-3 gap-6"
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={item}>
      <Card {...item} />
    </motion.div>
  ))}
</motion.div>
```

---

### 3. Parallax Effect (Optional)

```tsx
import { useScroll, useTransform, motion } from 'framer-motion'

export function ParallaxSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  
  return (
    <motion.div style={{ y }} className="relative">
      <Image src="/bg.jpg" alt="Background" />
    </motion.div>
  )
}
```

---

## 📱 Mobile Admin Dashboard (4-6 hours)

### 1. Responsive Sidebar

```tsx
// components/admin/mobile-sidebar.tsx
'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function MobileSidebar({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden p-2">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        {children}
      </SheetContent>
    </Sheet>
  )
}
```

---

### 2. Responsive Tables

```tsx
// components/admin/responsive-table.tsx
export function ResponsiveTable({ data, columns }: TableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          {/* Normal table */}
        </table>
      </div>
      
      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <div key={row.id} className="border rounded-lg p-4">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between py-2">
                <span className="font-medium">{col.label}:</span>
                <span>{row[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
```

---

### 3. Update Admin Layout

```tsx
// app/admin/layout.tsx
import { MobileSidebar } from '@/components/admin/mobile-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 border-r">
        <Sidebar />
      </aside>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b flex items-center px-4 z-50">
        <MobileSidebar>
          <Sidebar />
        </MobileSidebar>
        <h1 className="ml-4 font-semibold">Admin</h1>
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  )
}
```

---

## 🎯 Contact Page (2-3 hours)

### Create Contact Page

```tsx
// app/contact/page.tsx
import { ContactForm } from '@/components/contact/contact-form'
import { ContactInfo } from '@/components/contact/contact-info'
import { MapEmbed } from '@/components/contact/map-embed'

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Liên hệ</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Gửi tin nhắn</h2>
          <ContactForm />
        </div>
        
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Thông tin liên hệ</h2>
          <ContactInfo />
          
          {/* Map */}
          <div className="mt-8">
            <MapEmbed />
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Contact Form Component

```tsx
// components/contact/contact-form.tsx
'use client'

import { useState } from 'react'
import { TouchInput, TouchTextarea, TouchButton } from '@/components/mobile/touch-input'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Submit form
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
    
    setIsSubmitting(false)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TouchInput
        label="Họ tên"
        required
        placeholder="Nguyễn Văn A"
      />
      
      <TouchInput
        type="email"
        label="Email"
        required
        placeholder="email@example.com"
      />
      
      <TouchInput
        type="tel"
        label="Số điện thoại"
        required
        placeholder="0123456789"
      />
      
      <TouchTextarea
        label="Nội dung"
        required
        rows={5}
        placeholder="Nhập nội dung tin nhắn..."
      />
      
      <TouchButton
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
      </TouchButton>
    </form>
  )
}
```

---

## ✅ Implementation Checklist

### Day 1 (Quick Wins)
- [ ] Fix homepage image sizes
- [ ] Add hover effects
- [ ] Add loading skeletons
- [ ] Install Framer Motion
- [ ] Add basic animations

### Day 2 (Homepage)
- [ ] Animate hero section
- [ ] Add card animations
- [ ] Improve typography
- [ ] Add gradient effects
- [ ] Test on mobile

### Day 3-4 (Admin Mobile)
- [ ] Create mobile sidebar
- [ ] Make tables responsive
- [ ] Update admin layout
- [ ] Test all admin pages
- [ ] Fix touch targets

### Day 5 (Contact Page)
- [ ] Create contact page
- [ ] Build contact form
- [ ] Add contact info
- [ ] Integrate map
- [ ] Test form submission

---

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)

---

**Start with Day 1 for immediate visual improvements!**

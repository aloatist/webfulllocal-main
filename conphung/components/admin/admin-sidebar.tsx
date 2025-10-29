'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Image,
  Users,
  Settings,
  Home,
  Calendar,
  CreditCard,
  Star,
  BarChart3,
  Globe,
  Link2,
  Bed,
  MapPin,
  MessageSquare,
  Package,
  Ticket,
  Megaphone,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Tổng quan',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Nội dung',
    icon: FileText,
    children: [
      {
        title: 'Bài viết',
        href: '/admin/posts',
        icon: FileText,
      },
      {
        title: 'Danh mục',
        href: '/admin/categories',
        icon: FolderTree,
      },
      {
        title: 'Thẻ tag',
        href: '/admin/tags',
        icon: Tags,
      },
    ],
  },
  {
    title: 'Tours',
    icon: MapPin,
    children: [
      {
        title: 'Tất cả Tours',
        href: '/admin/tours',
        icon: MapPin,
      },
      {
        title: 'Đặt tour',
        href: '/admin/bookings',
        icon: Calendar,
      },
      
    ],
  },
  {
    title: 'Homestays',
    icon: Home,
    children: [
      {
        title: 'Tất cả Homestays',
        href: '/admin/homestays',
        icon: Home,
      },
      {
        title: 'Đặt phòng',
        href: '/admin/homestay-bookings',
        icon: Calendar,
      },
    
    ],
  },
  {
    title: 'Coco Island',
    icon: Bed,
    children: [
      {
        title: 'Cài đặt nội dung',
        href: '/admin/cocoisland',
        icon: Settings,
      },
      {
        title: 'Tích hợp',
        href: '/admin/integrations/cocoisland',
        icon: Link2,
      },
    ],
  },
  {
    title: 'Marketing',
    icon: Megaphone,
    children: [
      
      {
        title: 'Đánh giá',
        href: '/admin/reviews',
        icon: Star,
      },
      {
        title: 'Phân tích',
        href: '/admin/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Thư viện',
    href: '/admin/media',
    icon: Image,
  },
  // Tạm thời ẩn - Cần tích hợp backend authentication
  // {
  //   title: 'Users',
  //   href: '/admin/users',
  //   icon: Users,
  // },
  {
    title: 'Tích hợp',
    icon: Link2,
    children: [
      {
        title: 'Kênh bán',
        href: '/admin/integrations/channels',
        icon: Globe,
      },
      {
        title: 'Cài đặt',
        href: '/admin/integrations',
        icon: Settings,
      },
    ],
  },
  {
    title: 'Điều hướng',
    href: '/admin/navigation',
    icon: Link2,
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings,
  },
]

function NavItemComponent({ item, level = 0 }: { item: NavItem; level?: number }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const hasChildren = item.children && item.children.length > 0

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
            level > 0 && 'pl-6'
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {isOpen && (
          <div className="ml-2 mt-1 space-y-1 border-l border-border pl-2">
            {item.children?.map((child) => (
              <NavItemComponent key={child.title} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

  return (
    <Link
      href={item.href!}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
          : 'text-foreground hover:bg-accent hover:text-accent-foreground',
        level > 0 && 'pl-6'
      )}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.title}</span>
      {item.badge && (
        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="font-semibold">Quản trị</span>
        </Link>
      </div>
      <nav className="space-y-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 4rem)' }}>
        {navigation.map((item) => (
          <NavItemComponent key={item.title} item={item} />
        ))}
      </nav>
    </aside>
  )
}

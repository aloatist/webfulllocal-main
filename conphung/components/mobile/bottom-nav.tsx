'use client'

import { Home, Map, Hotel, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Trang chủ',
    icon: Home,
  },
  {
    href: '/tours',
    label: 'Tours',
    icon: Map,
  },
  {
    href: '/homestays',
    label: 'Homestay',
    icon: Hotel,
  },
  {
    href: '/news',
    label: 'Tin tức',
    icon: Calendar,
  },
  {
    href: '/admin',
    label: 'Quản lý',
    icon: User,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100000] bg-background border-t md:hidden shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                'active:scale-95 touch-manipulation',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'fill-current')} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

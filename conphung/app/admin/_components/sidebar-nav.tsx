"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  status?: "default" | "coming-soon";
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Nội dung",
    items: [
      { href: "/admin/posts", label: "Bài viết" },
      { href: "/admin/categories", label: "Danh mục" },
      { href: "/admin/tags", label: "Thẻ" },
      { href: "/admin/media", label: "Thư viện" },
    ],
  },
  {
    title: "Sản phẩm & giao dịch",
    items: [
      { href: "/admin/tours", label: "Tour" },
      { href: "/admin/cocoisland", label: "Coco Island" },
      { href: "/admin/bookings", label: "Booking tour" },
      { href: "/admin/homestay-bookings", label: "Booking homestay" },
      { href: "/admin/integrations/channels", label: "Kênh tích hợp" },
    ],
  },
  {
    title: "Tự động hóa",
    items: [
      { href: "/admin/social-media", label: "Social Media" },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { href: "/admin/homepage", label: "Trang chủ" },
      { href: "/admin/navigation", label: "Điều hướng" },
      { href: "/admin/users-management", label: "Quản lý Users" },
      { href: "/admin/settings", label: "Thiết lập", status: "coming-soon" },
    ],
  },
];

interface SidebarNavProps {
  groups?: NavGroup[];
  onNavigate?: () => void;
}

export function SidebarNav({ groups = NAV_GROUPS, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";

  return (
    <nav className="flex flex-1 flex-col gap-6">
      <div className="space-y-1">
        <Link
          href="/admin"
          onClick={onNavigate}
          className={cn(
            "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
            currentPath === "/admin"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          <span>Tổng quan</span>
        </Link>
      </div>
      {groups.map((group) => (
        <div key={group.title} className="space-y-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.title}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive =
                currentPath === item.href || currentPath.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  <span>{item.label}</span>
                  {item.status === "coming-soon" ? (
                    <span className="text-xs font-semibold uppercase text-amber-600">
                      Soon
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

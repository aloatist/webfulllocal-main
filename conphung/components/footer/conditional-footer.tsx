'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import server component với ssr: true
const ConditionalFooterWrapper = dynamic(
  () => import('./conditional-footer-wrapper').then(mod => ({ default: mod.ConditionalFooterWrapper })),
  { ssr: true }
);

/**
 * ConditionalFooter chỉ render footer khi KHÔNG phải homepage
 * Homepage sử dụng BlocksRenderer để render footer từ block
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Không render footer trong layout nếu là homepage (homepage dùng BlocksRenderer)
  if (pathname === '/') {
    return null;
  }
  
  // Render footer cho các trang khác
  return (
    <Suspense fallback={null}>
      <ConditionalFooterWrapper />
    </Suspense>
  );
}

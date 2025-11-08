import { Suspense } from 'react';
import { FooterWrapper } from './footer-wrapper';

/**
 * ConditionalFooterWrapper - Server component
 * Wrapper cho FooterWrapper với Suspense boundary
 * 
 * Note: Footer sẽ được render từ BlocksRenderer trên homepage
 * Component này chỉ render footer cho các trang khác
 * Việc check pathname được xử lý ở client component ConditionalFooter
 */
export function ConditionalFooterWrapper() {
  return (
    <Suspense fallback={null}>
      <FooterWrapper />
    </Suspense>
  );
}

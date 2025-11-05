import { getHomepageConfig } from '@/lib/homepage/sections';
import { ModernFooter } from './modern-footer';

export async function FooterWrapper() {
  const homepageConfig = await getHomepageConfig();
  
  return <ModernFooter data={homepageConfig?.footer} />;
}



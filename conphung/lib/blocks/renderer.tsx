/**
 * Block Renderer - Dynamic rendering of homepage blocks
 * Maps block types to React components
 */

import { HeroBlock } from '@/components/blocks/HeroBlock';
import { AboutBlock } from '@/components/blocks/AboutBlock';
import { FeatureBlock } from '@/components/blocks/FeatureBlock';
import { TourListBlock } from '@/components/blocks/TourListBlock';
import { TestimonialBlock } from '@/components/blocks/TestimonialBlock';
import { CTABlock } from '@/components/blocks/CTABlock';
import { FooterCTABlock } from '@/components/blocks/FooterCTABlock';

export interface HomepageBlock {
  id: string;
  type: string;
  title?: string | null;
  fields: any;
  sortOrder: number;
  status: string;
  themeId?: string | null;
}

// Block Component Registry
const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  about: AboutBlock,
  feature: FeatureBlock,
  tourList: TourListBlock,
  testimonial: TestimonialBlock,
  cta: CTABlock,
  footerCta: FooterCTABlock,
};

export function renderBlock(block: HomepageBlock) {
  // Only render active blocks
  if (block.status !== 'ACTIVE') {
    return null;
  }

  const Component = BLOCK_COMPONENTS[block.type];
  
  if (!Component) {
    console.warn(`Unknown block type: ${block.type}`);
    return null;
  }

  return <Component key={block.id} fields={block.fields} />;
}

export function renderBlocks(blocks: HomepageBlock[]) {
  // Sort by sortOrder
  const sortedBlocks = [...blocks].sort((a, b) => a.sortOrder - b.sortOrder);
  
  return (
    <>
      {sortedBlocks.map((block) => renderBlock(block))}
    </>
  );
}


/**
 * Homepage với Block-based System
 * Tạm thời tạo file mới để test, sau đó có thể thay thế page.tsx
 */

import { prisma } from '@/lib/prisma';
import { renderBlocks, type HomepageBlock } from '@/lib/blocks/renderer';
import { Section, Container } from '@/components/craft';
import { TemplateWrapper } from '@/components/home/template-wrapper';
import { getActiveTemplateServer } from '@/lib/templates/template-loader';

export const dynamic = 'force-dynamic';

export default async function HomePageBlocks() {
  // Load active blocks from database
  const blocks = await prisma.homepageBlock.findMany({
    where: {
      status: 'ACTIVE',
      themeId: null, // Only global blocks for now
    },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      type: true,
      title: true,
      fields: true,
      sortOrder: true,
      status: true,
      themeId: true,
    },
  });

  // Load active template
  const activeTemplate = await getActiveTemplateServer();

  return (
    <TemplateWrapper template={activeTemplate}>
      <Section>
        <Container>
          {renderBlocks(blocks as HomepageBlock[])}
        </Container>
      </TemplateWrapper>
    </TemplateWrapper>
  );
}


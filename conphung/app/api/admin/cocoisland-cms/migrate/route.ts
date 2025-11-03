import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { cocoIslandConfigSchema } from '@/lib/cocoisland/schema';
import {
  heroContent,
  stayPerks,
  experiences,
  restaurantSection,
  discoverySection,
  testimonials,
  services,
  contactInfo,
  newsletterContent,
} from '@/lib/cocoisland/data';

export const dynamic = 'force-dynamic';

// POST - Migrate sample data from cocoisland/data.ts to database
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Build config from existing data.ts exports
    const sampleConfig = {
      hero: heroContent,
      stayPerks,
      experiences: { experiences },
      restaurant: restaurantSection,
      discovery: discoverySection,
      testimonials: { testimonials },
      services: { services },
      contact: contactInfo,
      newsletter: newsletterContent,
    };

    // Validate config
    const validatedConfig = cocoIslandConfigSchema.parse(sampleConfig);

    // Get existing settings
    const existing = await prisma.cocoIslandSettings.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    const data: any = {
      sections: validatedConfig,
      status: 'DRAFT',
      updatedBy: session.user.id,
      version: existing ? existing.version + 1 : 1,
    };

    // Upsert
    if (existing) {
      await prisma.cocoIslandSettings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.cocoIslandSettings.create({
        data,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Đã migrate dữ liệu mẫu thành công!',
      migratedSections: Object.keys(validatedConfig),
    });
  } catch (error: any) {
    console.error('Error migrating cocoisland data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to migrate data' },
      { status: 500 }
    );
  }
}



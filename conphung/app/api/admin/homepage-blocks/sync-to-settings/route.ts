import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { homepageConfigSchema } from '@/lib/homepage/schema';

// POST - Sync blocks to homepage-settings
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

    const body = await request.json();
    const { status: targetStatus } = body; // 'DRAFT' or 'PUBLISHED'

    // Get all active blocks sorted by sortOrder
    const blocks = await prisma.homepageBlock.findMany({
      where: {
        status: 'ACTIVE',
        themeId: null, // Only global blocks
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Map block types to section keys
    const blockToSectionMap: Record<string, string> = {
      hero: 'hero',
      about: 'about',
      feature: 'features',
      promotion: 'promotion',
      ticket: 'ticket',
      tourList: 'tourPricing',
      homestay: 'homestay',
      testimonial: 'socialProof',
      gallery: 'gallery',
      videoGuide: 'videoGuide',
      faq: 'faq',
      restaurant: 'restaurant',
      certificates: 'certificates',
      latestPosts: 'latestPosts',
      map: 'map',
      cta: 'ctaBooking',
      pricingSnapshot: 'pricingSnapshot',
      policyLinks: 'policyLinks',
      footer: 'footer',
    };

    // Convert blocks to homepage config format
    const config: any = {};

    for (const block of blocks) {
      const sectionKey = blockToSectionMap[block.type];
      if (!sectionKey) continue;

      const sectionData = convertBlockToSectionData(block.type, block.fields);
      
      if (sectionData) {
        config[sectionKey] = sectionData;
      }
    }

    // Validate config with schema
    const validatedConfig = homepageConfigSchema.parse(config);

    // Get or create HomepageSettings
    const existing = await prisma.homepageSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const updateData: any = {
      sections: validatedConfig,
      updatedBy: session.user.id,
      version: existing ? existing.version + 1 : 1,
    };

    // Set status
    const finalStatus = targetStatus || 'DRAFT';
    if (finalStatus === 'PUBLISHED') {
      updateData.status = 'PUBLISHED';
      updateData.publishedAt = new Date();
    } else {
      updateData.status = 'DRAFT';
    }

    let savedSettings;
    if (existing) {
      savedSettings = await prisma.homepageSettings.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      savedSettings = await prisma.homepageSettings.create({
        data: {
          ...updateData,
          status: finalStatus as 'PUBLISHED' | 'DRAFT',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Đã đồng bộ ${blocks.length} blocks về homepage settings (${finalStatus})`,
      settings: savedSettings,
      blocksCount: blocks.length,
    });
  } catch (error) {
    console.error('Error syncing blocks to settings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync blocks to settings', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Convert block fields to section data format (reverse of convertSectionToBlockFields)
function convertBlockToSectionData(blockType: string, fields: any): any {
  switch (blockType) {
    case 'hero':
      return {
        eyebrow: fields.eyebrow || '',
        mainTitle: fields.title || '',
        subtitle: fields.subtitle || '',
        description: fields.description || '',
        backgroundImage: fields.backgroundImage || '',
        phone: fields.phone || '',
        address: fields.address || '',
        openingHours: fields.openingHours || '',
        primaryCta: {
          text: fields.primaryCtaText || '',
          link: fields.primaryCtaLink || '',
        },
        secondaryCta: {
          text: fields.secondaryCtaText || '',
          link: fields.secondaryCtaLink || '',
        },
        usps: fields.usps || [],
        isVisible: true,
      };
    case 'about':
      return {
        title: fields.title || '',
        content: fields.content || '',
        image: fields.image || '',
        imageId: fields.imageId || '',
        isActive: true,
        isVisible: true,
      };
    case 'feature':
      return {
        features: fields.features || [],
        eyebrow: fields.eyebrow || '',
        heading: fields.heading || '',
        description: fields.description || '',
        isVisible: true,
      };
    case 'promotion':
      return {
        eyebrow: fields.eyebrow || '',
        heading: fields.heading || '',
        description: fields.description || '',
        imageUrl: fields.imageUrl || '',
        discount: fields.discount || '',
        isActive: true,
        isVisible: true,
      };
    case 'pricingSnapshot':
      return {
        eyebrow: fields.eyebrow || '',
        heading: fields.heading || '',
        description: fields.description || '',
        paymentInfo: fields.paymentInfo || '',
        isActive: true,
        isVisible: true,
      };
    case 'ticket':
      return {
        eyebrow: fields.eyebrow || '',
        heading: fields.heading || '',
        subheading: fields.subheading || '',
        description: fields.description || '',
        prices: fields.prices || {},
        includedItems: fields.includedItems || [],
        pickupLocation: fields.pickupLocation || '',
        warningNote: fields.warningNote || '',
        imageUrl: fields.imageUrl || '',
        isVisible: true,
      };
    case 'tourList':
      return {
        eyebrow: fields.eyebrow || '',
        heading: fields.heading || '',
        description: fields.description || '',
        tours: fields.tours || [],
        highlights: fields.highlights || [],
        bottomNote: fields.bottomNote || '',
        isVisible: true,
      };
    case 'homestay':
      return {
        eyebrow: fields.eyebrow || '',
        heading: fields.heading || '',
        subheading: fields.subheading || '',
        description: fields.description || '',
        amenities: fields.amenities || [],
        highlights: fields.highlights || [],
        bottomNote: fields.bottomNote || '',
        cocoIslandCard: fields.cocoIslandCard || null,
        isActive: true,
        isVisible: true,
      };
    case 'testimonial':
      return {
        eyebrow: fields.eyebrow || '',
        heading: fields.heading || '',
        description: fields.description || '',
        overallRating: fields.overallRating || 0,
        ratingText: fields.ratingText || '',
        testimonials: fields.testimonials || [],
        trustStats: fields.trustStats || [],
        bottomCTAText: fields.bottomCTAText || '',
        bottomCTADescription: fields.bottomCTADescription || '',
        isActive: true,
        isVisible: true,
      };
    case 'gallery':
      return {
        heading: fields.heading || '',
        description: fields.description || '',
        images: fields.images || [],
        ecoFeatures: fields.ecoFeatures || [],
        bottomText: fields.bottomText || '',
        isVisible: true,
      };
    case 'videoGuide':
      return {
        heading: fields.heading || '',
        description: fields.description || '',
        videos: fields.videos || [],
        isVisible: true,
      };
    case 'faq':
      return {
        heading: fields.heading || '',
        items: fields.items || [],
        isActive: true,
        isVisible: true,
      };
    case 'restaurant':
      return {
        eyebrow: fields.eyebrow || '',
        title: fields.title || '',
        description: fields.description || '',
        capacity: fields.capacity || '',
        specialties: fields.specialties || [],
        image: fields.image || '',
        imageId: fields.imageId || '',
        isActive: true,
        isVisible: true,
      };
    case 'certificates':
      return {
        eyebrow: fields.eyebrow || '',
        heading: fields.heading || '',
        description: fields.description || '',
        certificates: fields.certificates || [],
        bottomNote: fields.bottomNote || '',
        isVisible: true,
      };
    case 'latestPosts':
      return {
        heading: fields.heading || '',
        description: fields.description || '',
        ctaText: fields.ctaText || '',
        ctaLink: fields.ctaLink || '',
        postCount: fields.postCount || 3,
        isVisible: true,
      };
    case 'map':
      return {
        heading: fields.heading || '',
        description: fields.description || '',
        embedUrl: fields.embedUrl || '',
        address: fields.address || '',
        coordinates: fields.coordinates || {},
        isVisible: true,
      };
    case 'cta':
      return {
        heading: fields.heading || '',
        description: fields.description || '',
        ctaText: fields.ctaText || '',
        ctaLink: fields.ctaLink || '',
        phone: fields.phone || '',
        features: fields.features || [],
        isVisible: true,
      };
    case 'policyLinks':
      return {
        links: fields.links || [],
        isVisible: true,
      };
    case 'footer':
      return {
        ...fields,
        isActive: true,
        isVisible: true,
      };
    default:
      return null;
  }
}




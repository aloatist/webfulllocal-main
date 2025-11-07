import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { getHomepageConfig } from '@/lib/homepage/sections';

// POST - Sync homepage config to blocks
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const homepageConfig = await getHomepageConfig();
    
    // Map homepage sections to block types
    const sectionToBlockMap: Record<string, string> = {
      hero: 'hero',
      about: 'about',
      features: 'feature',
      promotion: 'promotion',
      ticket: 'ticket',
      tourPricing: 'tourList',
      homestay: 'homestay',
      socialProof: 'testimonial',
      gallery: 'gallery',
      videoGuide: 'videoGuide',
      faq: 'faq',
      restaurant: 'restaurant',
      certificates: 'certificates',
      latestPosts: 'latestPosts',
      map: 'map',
      ctaBooking: 'cta',
      pricingSnapshot: 'pricingSnapshot',
      policyLinks: 'policyLinks',
      footer: 'footer',
    };

    const blocks: Array<{
      type: string;
      title: string;
      fields: any;
      sortOrder: number;
      status: string;
    }> = [];

    let sortOrder = 0;

    // Define the order based on homepage (exact order from page.tsx)
    const sectionOrder = [
      'hero',
      'about',
      'features',
      'promotion',
      'pricingSnapshot',
      'tourPricing',
      'ticket',
      'homestay',
      'socialProof',
      'gallery',
      'videoGuide',
      'faq',
      'restaurant',
      'certificates',
      'latestPosts',
      'map',
      'ctaBooking',
      'policyLinks',
      'footer',
    ];

    for (const sectionKey of sectionOrder) {
      const blockType = sectionToBlockMap[sectionKey];
      if (!blockType) continue;

      const sectionData = (homepageConfig as any)[sectionKey];
      if (!sectionData) continue;

      // Check if section is active
      if (sectionData.isActive === false) continue;

      // Convert section data to block fields
      const fields = convertSectionToBlockFields(sectionKey, sectionData);
      
      blocks.push({
        type: blockType,
        title: getBlockTitle(sectionKey, sectionData),
        fields,
        sortOrder: sortOrder++,
        status: 'ACTIVE',
      });
    }

    // Delete existing blocks
    await prisma.homepageBlock.deleteMany({});

    // Create new blocks
    const createdBlocks = await Promise.all(
      blocks.map((block) =>
        prisma.homepageBlock.create({
          data: {
            type: block.type,
            title: block.title,
            fields: block.fields,
            sortOrder: block.sortOrder,
            status: block.status as any,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Đã đồng bộ ${createdBlocks.length} blocks từ homepage config`,
      blocks: createdBlocks,
    });
  } catch (error) {
    console.error('Error syncing blocks:', error);
    return NextResponse.json(
      { error: 'Failed to sync blocks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function convertSectionToBlockFields(sectionKey: string, sectionData: any): any {
  switch (sectionKey) {
    case 'hero':
      return {
        eyebrow: sectionData.eyebrow || '',
        title: sectionData.mainTitle || sectionData.title || '',
        subtitle: sectionData.subtitle || '',
        description: sectionData.description || '',
        backgroundImage: sectionData.backgroundImage || '',
        phone: sectionData.phone || '',
        address: sectionData.address || '',
        openingHours: sectionData.openingHours || '',
        primaryCtaText: sectionData.primaryCta?.text || '',
        primaryCtaLink: sectionData.primaryCta?.link || '',
        secondaryCtaText: sectionData.secondaryCta?.text || '',
        secondaryCtaLink: sectionData.secondaryCta?.link || '',
        usps: sectionData.usps || [],
      };
    case 'about':
      return {
        title: sectionData.title || '',
        content: sectionData.content || '',
        image: sectionData.image || '',
        imageId: sectionData.imageId || '',
      };
    case 'features':
      return {
        eyebrow: sectionData.eyebrow || '',
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        features: sectionData.features || [],
      };
    case 'promotion':
      return {
        eyebrow: sectionData.eyebrow || '',
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        imageUrl: sectionData.imageUrl || '',
        discount: sectionData.discount || '',
      };
    case 'pricingSnapshot':
      return {
        eyebrow: sectionData.eyebrow || '',
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        paymentInfo: sectionData.paymentInfo || '',
      };
    case 'ticket':
      return {
        eyebrow: sectionData.eyebrow || '',
        heading: sectionData.heading || '',
        subheading: sectionData.subheading || '',
        description: sectionData.description || '',
        prices: sectionData.prices || {},
        includedItems: sectionData.includedItems || [],
        pickupLocation: sectionData.pickupLocation || '',
        warningNote: sectionData.warningNote || '',
        imageUrl: sectionData.imageUrl || '',
      };
    case 'tourPricing':
      return {
        eyebrow: sectionData.eyebrow || '',
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        tours: sectionData.tours || [],
        highlights: sectionData.highlights || [],
        bottomNote: sectionData.bottomNote || '',
      };
    case 'homestay':
      return {
        eyebrow: sectionData.eyebrow || '',
        heading: sectionData.heading || '',
        subheading: sectionData.subheading || '',
        description: sectionData.description || '',
        amenities: sectionData.amenities || [],
        highlights: sectionData.highlights || [],
        bottomNote: sectionData.bottomNote || '',
        cocoIslandCard: sectionData.cocoIslandCard || null,
      };
    case 'socialProof':
      return {
        eyebrow: sectionData.eyebrow || '',
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        overallRating: sectionData.overallRating || 0,
        ratingText: sectionData.ratingText || '',
        testimonials: sectionData.testimonials || [],
        trustStats: sectionData.trustStats || [],
        bottomCTAText: sectionData.bottomCTAText || '',
        bottomCTADescription: sectionData.bottomCTADescription || '',
      };
    case 'gallery':
      return {
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        images: sectionData.images || [],
        ecoFeatures: sectionData.ecoFeatures || [],
        bottomText: sectionData.bottomText || '',
      };
    case 'videoGuide':
      return {
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        videos: sectionData.videos || [],
      };
    case 'faq':
      return {
        heading: sectionData.heading || '',
        items: sectionData.items || [],
      };
    case 'restaurant':
      return {
        eyebrow: sectionData.eyebrow || '',
        title: sectionData.title || '',
        description: sectionData.description || '',
        capacity: sectionData.capacity || '',
        specialties: sectionData.specialties || [],
        image: sectionData.image || '',
        imageId: sectionData.imageId || '',
      };
    case 'certificates':
      return {
        eyebrow: sectionData.eyebrow || '',
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        certificates: sectionData.certificates || [],
        bottomNote: sectionData.bottomNote || '',
      };
    case 'latestPosts':
      return {
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        ctaText: sectionData.ctaText || '',
        ctaLink: sectionData.ctaLink || '',
        postCount: sectionData.postCount || 3,
      };
    case 'map':
      return {
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        embedUrl: sectionData.embedUrl || '',
        address: sectionData.address || '',
        coordinates: sectionData.coordinates || {},
      };
    case 'ctaBooking':
      return {
        heading: sectionData.heading || '',
        description: sectionData.description || '',
        ctaText: sectionData.ctaText || '',
        ctaLink: sectionData.ctaLink || '',
        phone: sectionData.phone || '',
        features: sectionData.features || [],
      };
    case 'policyLinks':
      return {
        links: sectionData.links || [],
      };
    case 'footer':
      return {
        contactHeading: sectionData.contactHeading || '',
        contactDescription: sectionData.contactDescription || '',
        showTeamMembers: sectionData.showTeamMembers !== false,
        teamMembers: sectionData.teamMembers || [],
        logoUrl: sectionData.logoUrl || '',
        companyDescription: sectionData.companyDescription || '',
        socialLinks: sectionData.socialLinks || [],
        linkGroups: sectionData.linkGroups || [],
        contactInfo: sectionData.contactInfo || [],
        newsletterTitle: sectionData.newsletterTitle || '',
        newsletterDescription: sectionData.newsletterDescription || '',
        newsletterEnabled: sectionData.newsletterEnabled !== false,
        companyName: sectionData.companyName || '',
        taxCode: sectionData.taxCode || '',
        businessLicense: sectionData.businessLicense || '',
        foodSafetyCert: sectionData.foodSafetyCert || '',
        bankAccount: sectionData.bankAccount || '',
        address: sectionData.address || '',
        copyrightText: sectionData.copyrightText || '',
      };
    default:
      return sectionData;
  }
}

function getBlockTitle(sectionKey: string, sectionData: any): string {
  const titleMap: Record<string, (data: any) => string> = {
    hero: (data) => data.mainTitle || data.title || 'Hero Section',
    about: (data) => data.title || 'About Section',
    features: (data) => data.heading || 'Features Section',
    promotion: (data) => data.heading || 'Promotion Section',
    pricingSnapshot: (data) => data.heading || 'Pricing Snapshot',
    ticket: (data) => data.heading || 'Ticket Section',
    tourPricing: (data) => data.heading || 'Tour Pricing',
    homestay: (data) => data.heading || 'Homestay Section',
    socialProof: (data) => data.heading || 'Social Proof',
    gallery: (data) => data.heading || 'Gallery',
    videoGuide: (data) => data.heading || 'Video Guide',
    faq: (data) => data.heading || 'FAQ',
    restaurant: (data) => data.title || 'Restaurant',
    certificates: (data) => data.heading || 'Certificates',
    latestPosts: (data) => data.heading || 'Latest Posts',
    map: (data) => data.heading || 'Map',
    ctaBooking: (data) => data.heading || 'CTA Booking',
    policyLinks: () => 'Policy Links',
    footer: () => 'Footer',
  };

  const getter = titleMap[sectionKey];
  return getter ? getter(sectionData) : `${sectionKey} Block`;
}


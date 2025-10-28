/**
 * Structured Data (JSON-LD) Generators for SEO
 * Follows schema.org standards
 */

import { Tour, Homestay, Post } from '@prisma/client';

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

/**
 * Generate structured data for Tour pages
 */
export function generateTourStructuredData(tour: any): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.summary || tour.seoDescription,
    image: tour.heroImageUrl,
    url: `https://conphungtourist.com//tours/${tour.slug}`,
    offers: {
      '@type': 'Offer',
      price: tour.basePrice?.toString(),
      priceCurrency: tour.currency || 'VND',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
    provider: {
      '@type': 'TouristInformationCenter',
      name: 'Khu Du Lịch Cồn Phụng',
      url: 'https://conphungtourist.com/',
      telephone: '+84-xxx-xxx-xxx',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bến Tre',
        addressCountry: 'VN',
      },
    },
    duration: `P${tour.durationDays}D`,
    ...(tour.itineraryDays && tour.itineraryDays.length > 0 && {
      itinerary: tour.itineraryDays.map((day: any, index: number) => ({
        '@type': 'ItemList',
        itemListElement: {
          '@type': 'ListItem',
          position: index + 1,
          name: day.title || `Ngày ${day.dayNumber}`,
          description: day.description,
        },
      })),
    }),
    ...(tour.reviews && tour.reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: calculateAverageRating(tour.reviews),
        reviewCount: tour.reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

/**
 * Generate structured data for Homestay pages
 */
export function generateHomestayStructuredData(homestay: any): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: homestay.title,
    description: homestay.summary || homestay.seoDescription,
    image: homestay.heroImageUrl,
    url: `https://conphungtourist.com//homestays/${homestay.slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: homestay.addressLine1,
      addressLocality: homestay.city,
      addressRegion: homestay.state,
      postalCode: homestay.postalCode,
      addressCountry: homestay.country || 'VN',
    },
    ...(homestay.latitude && homestay.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: homestay.latitude.toString(),
        longitude: homestay.longitude.toString(),
      },
    }),
    priceRange: homestay.basePrice ? `${homestay.basePrice} ${homestay.currency}` : undefined,
    telephone: homestay.contactPhone,
    email: homestay.contactEmail,
    checkinTime: homestay.checkInTimeStart || '15:00',
    checkoutTime: homestay.checkOutTime || '12:00',
    numberOfRooms: homestay.bedrooms,
    petsAllowed: homestay.hasPetFriendly,
    smokingAllowed: homestay.hasSmokingAllowed,
    amenityFeature: generateAmenityFeatures(homestay),
    ...(homestay.ratingAverage && homestay.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: homestay.ratingAverage.toString(),
        reviewCount: homestay.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

/**
 * Generate structured data for Blog/News posts
 */
export function generatePostStructuredData(post: any): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.seo?.description,
    image: post.featuredImage?.url,
    url: `https://conphungtourist.com//news/${post.slug}`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Cồn Phụng Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Khu Du Lịch Cồn Phụng',
      url: 'https://conphungtourist.com/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://conphungtourist.com//logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://conphungtourist.com//news/${post.slug}`,
    },
    ...(post.categories && post.categories.length > 0 && {
      articleSection: post.categories.map((cat: any) => cat.name).join(', '),
    }),
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.map((tag: any) => tag.name).join(', '),
    }),
  };
}

/**
 * Generate structured data for Organization (for homepage)
 */
export function generateOrganizationStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristInformationCenter',
    name: 'Khu Du Lịch Cồn Phụng',
    alternateName: 'Cồn Phụng Tourist Area',
    url: 'https://conphungtourist.com/',
    logo: 'https://conphungtourist.com//logo.png',
    description: 'Khu du lịch sinh thái Cồn Phụng - Điểm đến lý tưởng tại Bến Tre với công trình Đạo Dừa độc đáo',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bến Tre',
      addressRegion: 'Bến Tre',
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-xxx-xxx-xxx',
      contactType: 'customer service',
      availableLanguage: ['vi', 'en'],
    },
    sameAs: [
      'https://www.facebook.com/conphung',
      'https://www.instagram.com/conphung',
      'https://www.youtube.com/@conphung',
    ],
  };
}

/**
 * Generate structured data for BreadcrumbList
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate structured data for FAQPage
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Helper functions

function calculateAverageRating(reviews: any[]): number {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

function generateAmenityFeatures(homestay: any): any[] {
  const amenities = [];

  if (homestay.hasWifi) {
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Free WiFi',
      value: true,
    });
  }

  if (homestay.hasParking) {
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Free Parking',
      value: true,
    });
  }

  if (homestay.hasPool) {
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Swimming Pool',
      value: true,
    });
  }

  if (homestay.hasKitchen) {
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Kitchen',
      value: true,
    });
  }

  if (homestay.hasAirConditioning) {
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Air Conditioning',
      value: true,
    });
  }

  return amenities;
}

/**
 * Render structured data as JSON-LD script tag
 */
export function renderStructuredData(data: StructuredData): string {
  return JSON.stringify(data, null, 2);
}

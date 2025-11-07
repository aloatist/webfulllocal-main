/**
 * Homestay/Lodging Business Schema for SEO
 * Helps search engines understand accommodation information
 * Based on schema.org LodgingBusiness type
 */

import { siteConfig } from '@/site.config';

interface HomestaySchemaProps {
  homestay: {
    title: string;
    slug: string;
    summary?: string | null;
    heroImageUrl?: string | null;
    pricePerNight?: number | string | null;
    city?: string | null;
    district?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    maxGuests?: number | null;
    numBedrooms?: number | null;
    numBathrooms?: number | null;
    amenities?: string[] | null;
    checkinTime?: string | null;
    checkoutTime?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
  };
}

export function HomestaySchema({ homestay }: HomestaySchemaProps) {
  const baseUrl = siteConfig.site_domain || 'https://conphungtourist.com';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": homestay.title,
    "description": homestay.summary || `Homestay ${homestay.title} tại ${homestay.city || 'Vĩnh Long'}`,
    "url": `${baseUrl}/homestays/${homestay.slug}`,
    "image": homestay.heroImageUrl || `${baseUrl}/logo.webp`,
    
    // Location
    "address": {
      "@type": "PostalAddress",
      "streetAddress": homestay.address || '',
      "addressLocality": homestay.district || '',
      "addressRegion": homestay.city || 'Vĩnh Long',
      "addressCountry": "VN"
    },
    
    // Geo coordinates (if available)
    ...(homestay.latitude && homestay.longitude ? {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": homestay.latitude,
        "longitude": homestay.longitude
      }
    } : {}),
    
    // Price
    "priceRange": homestay.pricePerNight 
      ? `${homestay.pricePerNight}đ - ${Number(homestay.pricePerNight) * 1.5}đ`
      : "₫₫",
    
    // Contact info
    "telephone": "+84917645039",
    "email": "conphung87@yahoo.com.vn",
    
    // Rating (if available)
    ...(homestay.rating && homestay.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": homestay.rating,
        "reviewCount": homestay.reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {}),
    
    // Amenities
    ...(homestay.amenities && homestay.amenities.length > 0 ? {
      "amenityFeature": homestay.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      }))
    } : {}),
    
    // Check-in/out times
    ...(homestay.checkinTime ? { "checkinTime": homestay.checkinTime } : {}),
    ...(homestay.checkoutTime ? { "checkoutTime": homestay.checkoutTime } : {}),
    
    // Occupancy
    ...(homestay.maxGuests ? {
      "maximumAttendeeCapacity": homestay.maxGuests
    } : {}),
    
    // Bedrooms & Bathrooms
    ...(homestay.numBedrooms ? { "numberOfRooms": homestay.numBedrooms } : {}),
    ...(homestay.numBathrooms ? { "numberOfBathroomsTotal": homestay.numBathrooms } : {}),
    
    // Additional properties
    "petsAllowed": false,
    "smokingAllowed": false,
    "starRating": {
      "@type": "Rating",
      "ratingValue": "3"
    },
    
    // Provider (parent organization)
    "provider": {
      "@type": "TouristAttraction",
      "name": "Khu Du Lịch Cồn Phụng",
      "url": baseUrl,
      "telephone": "+84917645039"
    }
  };

  // Clean up undefined values
  const cleanData = JSON.parse(
    JSON.stringify(schema, (key, value) => 
      value === undefined ? undefined : value
    )
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanData, null, 0) }}
    />
  );
}




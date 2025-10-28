import type { PublicTourDetail } from '@/lib/tours/public';
import { siteConfig } from '@/site.config';

interface SchemaTourProps {
  tour: NonNullable<PublicTourDetail>;
}

export function SchemaTour({ tour }: SchemaTourProps) {
  const heroImage = tour.heroImageUrl ?? tour.TourMedia?.[0]?.Media?.url ?? '';

  // Tạo structured data theo schema.org
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.summary,
    image: heroImage ? [heroImage] : [],
    tourDistance: `${tour.durationDays} ngày`,
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: tour.durationDays,
      itemListElement: tour.ItineraryDay?.map(day => ({
        '@type': 'ListItem',
        position: day.dayNumber,
        name: day.title ?? `Ngày ${day.dayNumber}`,
        description: day.description,
        item: {
          '@type': 'Place',
          name: day.stayInfo ?? 'Điểm du lịch Cồn Phụng'
        }
      })) ?? [],
    },
    provider: {
      '@type': 'Organization',
      name: 'KDL Cồn Phụng',
      url: 'https://conphungtourist.com',
      telephone: '+84918267715',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Vĩnh Long',
        addressCountry: 'VN'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+84918267715',
        contactType: 'Customer Service'
      }
    },
    offers: tour.TourDeparture?.map(departure => ({
      '@type': 'Offer',
      price: departure.priceAdult ? departure.priceAdult.toString() : tour.basePrice?.toString(),
      priceCurrency: tour.currency ?? 'VND',
      availability: departure.seatsAvailable && departure.seatsAvailable > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      validFrom: departure.startDate,
      availabilityStarts: departure.startDate,
      availabilityEnds: departure.endDate,
      seller: {
        '@type': 'Organization',
        name: 'Khu du lịch Cồn Phụng'
      }
    })) ?? [{
      '@type': 'Offer',
      price: tour.basePrice?.toString(),
      priceCurrency: tour.currency ?? 'VND',
      seller: {
        '@type': 'Organization',
        name: 'Khu du lịch Cồn Phụng'
      }
    }],
    aggregateRating: tour.TourReview && tour.TourReview.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: (tour.TourReview.reduce((sum, review) => sum + review.rating, 0) / tour.TourReview.length).toFixed(1),
      reviewCount: tour.TourReview.length,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    review: tour.TourReview?.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.fullName
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5
      },
      reviewBody: review.content
    })) ?? []
  };

  // Filter out undefined values
  const cleanData = JSON.parse(JSON.stringify(structuredData, (key, value) =>
    value === undefined ? undefined : value
  ));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cleanData, null, 0)
      }}
    />
  );
}

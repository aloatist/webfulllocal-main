/**
 * Organization Schema for SEO
 * Helps search engines understand business information
 */

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Khu Du Lịch Cồn Phụng",
    "alternateName": "Cồn Phụng Tourist",
    "url": "https://conphungtourist.com",
    "logo": "https://conphungtourist.com/logo.webp",
    "description": "Khu du lịch sinh thái Cồn Phụng - Điểm đến văn hóa Đạo Dừa độc đáo tại Bến Tre",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cồn Phụng, xã Phú Nhuận",
      "addressLocality": "Bến Tre",
      "addressRegion": "Bến Tre",
      "postalCode": "86000",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.2833,
      "longitude": 106.4167
    },
    "telephone": "+84917645039",
    "email": "conphung87@yahoo.com.vn",
    "priceRange": "₫₫",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "07:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/conphungtourist",
      "https://www.youtube.com/@conphungtourist"
    ],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 10.2833,
        "longitude": 106.4167
      },
      "geoRadius": "100000"
    },
    "hasMap": "https://www.google.com/maps/place/Cồn+Phụng",
    "isAccessibleForFree": false,
    "publicAccess": true,
    "touristType": [
      "Gia đình",
      "Nhóm bạn",
      "Công ty",
      "Team building"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

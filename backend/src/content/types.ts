export interface HeroSection {
  backgroundImage: string;
  typingText: string;
  description: string;
}

export interface PromotionSection {
  title: string;
  cardImage: string;
  cardImageAlt: string;
}

export interface TicketSection {
  title: string;
  image: string;
  imageAlt: string;
  adultPrice: string;
  childPrice: string;
  benefits: string[];
  note: string;
}

export interface TourSection {
  title: string;
  image: string;
  imageAlt: string;
  originalPrice: string;
  promoPrice: string;
  benefits: string[];
}

export interface HomestaySection {
  title: string;
  image: string;
  imageAlt: string;
  originalPrice: string;
  promoPrice: string;
  benefits: string[];
  amenities: string[];
}

export interface RestaurantSection {
  title: string;
  description: string;
  menuHighlights: string[];
  note: string;
}

export interface DocumentItem {
  title: string;
  image: string;
  alt: string;
  link: string;
}

export interface MapSection {
  title: string;
  embedUrl: string;
  titleAttribute: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GallerySection {
  title: string;
  images: GalleryImage[];
}

export interface CallToActionSection {
  title: string;
  description: string;
  phoneNumber: string;
  buttonLabel: string;
}

export interface VideoItem {
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  alt: string;
}

export interface VideoSection {
  title: string;
  items: VideoItem[];
}

export interface CommitmentItem {
  title: string;
  description: string;
  icon: string;
}

export interface PolicyLink {
  title: string;
  href: string;
  icon: string;
}

export interface HomeContent {
  hero: HeroSection;
  monthlyPromotion: PromotionSection;
  ticket: TicketSection;
  tour: TourSection;
  homestay: HomestaySection;
  restaurant: RestaurantSection;
  documents: DocumentItem[];
  map: MapSection;
  gallery: GallerySection;
  callToAction: CallToActionSection;
  videos: VideoSection;
  commitments: CommitmentItem[];
  policyLinks: PolicyLink[];
}

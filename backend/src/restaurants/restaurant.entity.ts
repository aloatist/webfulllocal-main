import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyEntity } from '../properties/property.entity';

export enum RestaurantType {
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  CAFE = 'cafe',
  LOUNGE = 'lounge',
  CLUB = 'club',
  BAKERY = 'bakery',
  STREET_FOOD = 'street_food',
  OTHER = 'other',
}

export enum RestaurantPriceLevel {
  BUDGET = 'budget',
  MIDRANGE = 'midrange',
  LUXURY = 'luxury',
}

export enum RestaurantStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('restaurants')
export class RestaurantEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: RestaurantType.RESTAURANT,
  })
  type!: RestaurantType;

  @Column({ name: 'cuisine_types', type: 'simple-array', nullable: true })
  cuisineTypes?: string[] | null;

  @Column({ type: 'text', nullable: true })
  summary?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'seo_title', type: 'varchar', length: 255, nullable: true })
  seoTitle?: string | null;

  @Column({
    name: 'seo_description',
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  seoDescription?: string | null;

  @Column({ name: 'seo_keywords', type: 'simple-array', nullable: true })
  seoKeywords?: string[] | null;

  @Column({ name: 'hero_image_id', type: 'uuid', nullable: true })
  heroImageId?: string | null;

  @Column({ name: 'gallery_image_ids', type: 'simple-json', nullable: true })
  galleryImageIds?: string[] | null;

  @Column({
    name: 'average_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  averagePrice?: string | null;

  @Column({ type: 'varchar', length: 5, default: 'VND' })
  currency!: string;

  @Column({
    name: 'price_level',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  priceLevel?: RestaurantPriceLevel | null;

  @Column({
    name: 'contact_email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  contactEmail?: string | null;

  @Column({
    name: 'contact_phone',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  contactPhone?: string | null;

  @Column({ name: 'website_url', type: 'varchar', length: 255, nullable: true })
  websiteUrl?: string | null;

  @Column({
    name: 'reservation_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  reservationUrl?: string | null;

  @Column({ name: 'address_line1', type: 'varchar', length: 255 })
  addressLine1!: string;

  @Column({
    name: 'address_line2',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  addressLine2?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  city?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  region?: string | null;

  @Column({ type: 'varchar', length: 120 })
  country!: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 30, nullable: true })
  postalCode?: string | null;

  @Column({ name: 'opening_hours', type: 'simple-json', nullable: true })
  openingHours?: Record<string, any> | null;

  @Column({ name: 'menu', type: 'simple-json', nullable: true })
  menu?: Array<{
    section: string;
    description?: string;
    items: Array<{
      name: string;
      description?: string;
      price?: number;
      currency?: string;
      tags?: string[];
    }>;
  }> | null;

  @Column({ name: 'amenities', type: 'simple-array', nullable: true })
  amenities?: string[] | null;

  @Column({ name: 'dietary_options', type: 'simple-array', nullable: true })
  dietaryOptions?: string[] | null;

  @Column({ type: 'float', nullable: true })
  latitude?: number | null;

  @Column({ type: 'float', nullable: true })
  longitude?: number | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 40,
    default: RestaurantStatus.DRAFT,
  })
  status!: RestaurantStatus;

  @ManyToOne(
    () => DestinationEntity,
    (destination) => destination.restaurants,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  destination?: DestinationEntity | null;

  @ManyToOne(() => PropertyEntity, { nullable: true, onDelete: 'SET NULL' })
  property?: PropertyEntity | null;
}

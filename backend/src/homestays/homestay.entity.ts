import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { TagEntity } from '../tags/tag.entity';
import { UserEntity } from '../users/user.entity';
import { HomestayRoomEntity } from './homestay-room.entity';
import { HomestayAvailabilityEntity } from './homestay-availability.entity';
import { HomestayPricingRuleEntity } from './homestay-pricing-rule.entity';
import { HomestayBookingEntity } from './homestay-booking.entity';
import { HomestayReviewEntity } from './homestay-review.entity';

export enum HomestayStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum HomestayType {
  ENTIRE_PLACE = 'entire_place',
  PRIVATE_ROOM = 'private_room',
  SHARED_ROOM = 'shared_room',
}

export enum HomestayCategory {
  VILLA = 'villa',
  APARTMENT = 'apartment',
  BUNGALOW = 'bungalow',
  FARM_STAY = 'farm_stay',
  OTHER = 'other',
}

@Entity('homestays')
export class HomestayEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  headline?: string | null;

  @Column({ type: 'text', nullable: true })
  summary?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    type: 'varchar',
    length: 40,
    default: HomestayStatus.DRAFT,
  })
  status!: HomestayStatus;

  @Column({
    type: 'varchar',
    length: 40,
    default: HomestayType.ENTIRE_PLACE,
  })
  type!: HomestayType;

  @Column({
    type: 'varchar',
    length: 40,
    default: HomestayCategory.OTHER,
  })
  category!: HomestayCategory;

  @Column({ type: 'varchar', length: 120, nullable: true })
  city?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  country?: string | null;

  @Column({ name: 'address_line1', type: 'varchar', length: 255, nullable: true })
  addressLine1?: string | null;

  @Column({ name: 'address_line2', type: 'varchar', length: 255, nullable: true })
  addressLine2?: string | null;

  @Column({ type: 'float', nullable: true })
  latitude?: number | null;

  @Column({ type: 'float', nullable: true })
  longitude?: number | null;

  @Column({ name: 'base_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  basePrice?: number | null;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency!: string;

  @Column({ name: 'max_guests', type: 'int', nullable: true })
  maxGuests?: number | null;

  @Column({ type: 'int', nullable: true })
  bedrooms?: number | null;

  @Column({ type: 'int', nullable: true })
  bathrooms?: number | null;

  @Column({ type: 'boolean', default: false })
  hasParking!: boolean;

  @Column({ type: 'boolean', default: true })
  hasWifi!: boolean;

  @Column({ type: 'boolean', default: false })
  hasKitchen!: boolean;

  @Column({ name: 'has_air_conditioning', type: 'boolean', default: false })
  hasAirConditioning!: boolean;

  @Column({ type: 'boolean', default: false })
  hasPool!: boolean;

  @Column({ name: 'has_pet_friendly', type: 'boolean', default: false })
  hasPetFriendly!: boolean;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ name: 'is_instant_book', type: 'boolean', default: false })
  isInstantBook!: boolean;

  @Column({ name: 'is_superhost', type: 'boolean', default: false })
  isSuperhost!: boolean;

  @Column({ name: 'hero_image_url', type: 'varchar', length: 255, nullable: true })
  heroImageUrl?: string | null;

  @Column({ name: 'gallery_image_urls', type: 'simple-json', nullable: true })
  galleryImageUrls?: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  amenities?: string[] | null;

  @Column({ name: 'house_rules', type: 'simple-array', nullable: true })
  houseRules?: string[] | null;

  @Column({ name: 'seo_title', type: 'varchar', length: 255, nullable: true })
  seoTitle?: string | null;

  @Column({ name: 'seo_description', type: 'varchar', length: 320, nullable: true })
  seoDescription?: string | null;

  @Column({ name: 'seo_keywords', type: 'simple-array', nullable: true })
  seoKeywords?: string[] | null;

  @Column({ name: 'rating_average', type: 'float', nullable: true })
  ratingAverage?: number | null;

  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount!: number;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  host!: Relation<UserEntity>;

  @ManyToOne(() => DestinationEntity, { nullable: true, onDelete: 'SET NULL' })
  destination?: Relation<DestinationEntity> | null;

  @ManyToMany(() => TagEntity, { cascade: true })
  @JoinTable({
    name: 'homestay_tags',
    joinColumn: { name: 'homestay_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags?: Relation<TagEntity[]>;

  @OneToMany(() => HomestayRoomEntity, (room) => room.homestay, { cascade: true })
  rooms?: Relation<HomestayRoomEntity[]>;

  @OneToMany(() => HomestayAvailabilityEntity, (availability) => availability.homestay, {
    cascade: true,
  })
  availability?: Relation<HomestayAvailabilityEntity[]>;

  @OneToMany(() => HomestayPricingRuleEntity, (rule) => rule.homestay, {
    cascade: true,
  })
  pricingRules?: Relation<HomestayPricingRuleEntity[]>;

  @OneToMany(() => HomestayBookingEntity, (booking) => booking.homestay)
  bookings?: Relation<HomestayBookingEntity[]>;

  @OneToMany(() => HomestayReviewEntity, (review) => review.homestay)
  reviews?: Relation<HomestayReviewEntity[]>;
}

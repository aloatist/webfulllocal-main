import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyRoomEntity } from '../rooms/property-room.entity';
import { TagEntity } from '../tags/tag.entity';
import { BookingEntity } from '../bookings/booking.entity';

export enum PropertyType {
  HOTEL = 'hotel',
  RESORT = 'resort',
  VILLA = 'villa',
  HOMESTAY = 'homestay',
  APARTMENT = 'apartment',
  HOSTEL = 'hostel',
  CAMPING = 'camping',
  CRUISE = 'cruise',
  OTHER = 'other',
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('properties')
export class PropertyEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: PropertyType.OTHER,
  })
  type!: PropertyType;

  @Column({
    type: 'varchar',
    length: 40,
    default: PropertyStatus.DRAFT,
  })
  status!: PropertyStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  headline?: string | null;

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

  @Column({ type: 'float', nullable: true })
  latitude?: number | null;

  @Column({ type: 'float', nullable: true })
  longitude?: number | null;

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

  @Column({ name: 'booking_url', type: 'varchar', length: 255, nullable: true })
  bookingUrl?: string | null;

  @Column({
    name: 'check_in_time',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  checkInTime?: string | null;

  @Column({
    name: 'check_out_time',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  checkOutTime?: string | null;

  @Column({ type: 'float', nullable: true })
  rating?: number | null;

  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount!: number;

  @Column({ type: 'simple-array', nullable: true })
  amenities?: string[] | null;

  @Column({ name: 'highlight_features', type: 'simple-json', nullable: true })
  highlightFeatures?: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  policies?: Record<string, any> | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @ManyToOne(() => DestinationEntity, (destination) => destination.properties, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  destination?: DestinationEntity | null;

  @OneToMany(() => PropertyRoomEntity, (room) => room.property, {
    cascade: true,
  })
  rooms?: PropertyRoomEntity[];

  @ManyToMany(() => TagEntity, { cascade: true })
  @JoinTable({
    name: 'property_tags',
    joinColumn: { name: 'property_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags?: TagEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.property)
  bookings?: BookingEntity[];
}

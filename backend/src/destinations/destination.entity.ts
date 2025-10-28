import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { PropertyEntity } from '../properties/property.entity';
import { ExperienceEntity } from '../experiences/experience.entity';
import { RestaurantEntity } from '../restaurants/restaurant.entity';
import { BookingEntity } from '../bookings/booking.entity';

export enum DestinationType {
  CITY = 'city',
  REGION = 'region',
  ISLAND = 'island',
  MOUNTAIN = 'mountain',
  COUNTRYSIDE = 'countryside',
  HERITAGE = 'heritage',
  ADVENTURE = 'adventure',
  OTHER = 'other',
}

@Entity('destinations')
export class DestinationEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: DestinationType.OTHER,
  })
  type!: DestinationType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  headline?: string | null;

  @Column({ type: 'text', nullable: true })
  summary?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'hero_image_id', type: 'uuid', nullable: true })
  heroImageId?: string | null;

  @Column({ name: 'gallery_image_ids', type: 'simple-json', nullable: true })
  galleryImageIds?: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[] | null;

  @Column({ type: 'float', nullable: true })
  latitude?: number | null;

  @Column({ type: 'float', nullable: true })
  longitude?: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  climate?: string | null;

  @Column({ type: 'text', nullable: true })
  travelTips?: string | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @Column({ type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ name: 'seo_title', type: 'varchar', length: 255, nullable: true })
  seoTitle?: string | null;

  @Column({
    name: 'seo_description',
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  seoDescription?: string | null;

  @OneToMany(() => PropertyEntity, (property) => property.destination)
  properties?: PropertyEntity[];

  @OneToMany(() => ExperienceEntity, (experience) => experience.destination)
  experiences?: ExperienceEntity[];

  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.destination)
  restaurants?: RestaurantEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.destination)
  bookings?: BookingEntity[];
}

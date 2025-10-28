import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyEntity } from '../properties/property.entity';

export enum ExperienceCategory {
  ADVENTURE = 'adventure',
  CULTURE = 'culture',
  FOOD = 'food',
  WELLNESS = 'wellness',
  CRUISE = 'cruise',
  SIGHTSEEING = 'sightseeing',
  NATURE = 'nature',
  OTHER = 'other',
}

export enum ExperienceDifficulty {
  EASY = 'easy',
  MODERATE = 'moderate',
  CHALLENGING = 'challenging',
}

export enum ExperienceStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('experiences')
export class ExperienceEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: ExperienceCategory.OTHER,
  })
  category!: ExperienceCategory;

  @Column({
    type: 'varchar',
    length: 40,
    default: ExperienceDifficulty.EASY,
  })
  difficulty!: ExperienceDifficulty;

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

  @Column({ name: 'highlight_points', type: 'simple-json', nullable: true })
  highlightPoints?: string[] | null;

  @Column({ name: 'hero_image_id', type: 'uuid', nullable: true })
  heroImageId?: string | null;

  @Column({ name: 'gallery_image_ids', type: 'simple-json', nullable: true })
  galleryImageIds?: string[] | null;

  @Column({ name: 'duration_hours', type: 'float', nullable: true })
  durationHours?: number | null;

  @Column({ name: 'group_size_min', type: 'int', nullable: true })
  groupSizeMin?: number | null;

  @Column({ name: 'group_size_max', type: 'int', nullable: true })
  groupSizeMax?: number | null;

  @Column({
    name: 'price_from',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  priceFrom?: string | null;

  @Column({ type: 'varchar', length: 5, default: 'VND' })
  currency!: string;

  @Column({
    name: 'availability_schedule',
    type: 'simple-json',
    nullable: true,
  })
  availabilitySchedule?: Record<string, any> | null;

  @Column({ name: 'itinerary', type: 'simple-json', nullable: true })
  itinerary?: Array<{
    title: string;
    description?: string;
    duration?: string;
  }> | null;

  @Column({ name: 'inclusions', type: 'simple-array', nullable: true })
  inclusions?: string[] | null;

  @Column({ name: 'exclusions', type: 'simple-array', nullable: true })
  exclusions?: string[] | null;

  @Column({
    name: 'meeting_point',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  meetingPoint?: string | null;

  @Column({ type: 'float', nullable: true })
  latitude?: number | null;

  @Column({ type: 'float', nullable: true })
  longitude?: number | null;

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

  @Column({
    name: 'status',
    type: 'varchar',
    length: 40,
    default: ExperienceStatus.DRAFT,
  })
  status!: ExperienceStatus;

  @Column({ name: 'tags', type: 'simple-array', nullable: true })
  tags?: string[] | null;

  @Column({ name: 'metadata', type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @ManyToOne(
    () => DestinationEntity,
    (destination) => destination.experiences,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  destination?: DestinationEntity | null;

  @ManyToOne(() => PropertyEntity, { nullable: true, onDelete: 'SET NULL' })
  property?: PropertyEntity | null;
}

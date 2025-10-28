import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { TagEntity } from '../tags/tag.entity';

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
  TOUR = 'tour',
  SOUVENIR = 'souvenir',
  OTHER = 'other',
}

@Entity('products')
export class ProductEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Column({ type: 'varchar', length: 120, nullable: true, unique: true })
  sku?: string | null;

  @Column({
    type: 'varchar',
    length: 40,
    default: ProductType.OTHER,
  })
  type!: ProductType;

  @Column({
    type: 'varchar',
    length: 40,
    default: ProductStatus.DRAFT,
  })
  status!: ProductStatus;

  @Column({ type: 'text', nullable: true })
  summary?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  price?: string | null;

  @Column({
    name: 'compare_at_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  compareAtPrice?: string | null;

  @Column({ type: 'varchar', length: 5, default: 'VND' })
  currency!: string;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity!: number;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ name: 'weight_grams', type: 'int', nullable: true })
  weightGrams?: number | null;

  @Column({ name: 'dimensions', type: 'simple-json', nullable: true })
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  } | null;

  @Column({ name: 'attributes', type: 'simple-json', nullable: true })
  attributes?: Record<string, any> | null;

  @Column({ name: 'hero_image_id', type: 'uuid', nullable: true })
  heroImageId?: string | null;

  @Column({ name: 'gallery_image_ids', type: 'simple-json', nullable: true })
  galleryImageIds?: string[] | null;

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

  @Column({
    name: 'canonical_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  canonicalUrl?: string | null;

  @Column({ name: 'available_from', type: 'datetime', nullable: true })
  availableFrom?: Date | null;

  @Column({ name: 'available_to', type: 'datetime', nullable: true })
  availableTo?: Date | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @ManyToMany(() => TagEntity, { cascade: true })
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags?: TagEntity[];
}

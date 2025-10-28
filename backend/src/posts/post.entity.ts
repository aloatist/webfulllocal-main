import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { UserEntity } from '../users/user.entity';
import { TagEntity } from '../tags/tag.entity';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('posts')
export class PostEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subtitle?: string | null;

  @Column({ type: 'text', nullable: true })
  excerpt?: string | null;

  @Column({ type: 'text' })
  content!: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus;

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

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt?: Date | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  author?: UserEntity | null;

  @ManyToMany(() => TagEntity, { cascade: true })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags?: TagEntity[];
}

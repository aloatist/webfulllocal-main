import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ReviewTargetType {
  DESTINATION = 'destination',
  PROPERTY = 'property',
  ROOM = 'room',
  EXPERIENCE = 'experience',
  RESTAURANT = 'restaurant',
}

@Entity('reviews')
export class ReviewEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 40 })
  targetType!: ReviewTargetType;

  @Column({ type: 'uuid' })
  targetId!: string;

  @Column({ type: 'varchar', length: 255 })
  targetName!: string;

  @Column({ type: 'varchar', length: 255 })
  authorName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  authorEmail?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  authorCountry?: string | null;

  @Column({ type: 'int', default: 5 })
  rating!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string | null;

  @Column({ type: 'text', nullable: true })
  body?: string | null;

  @Column({ name: 'visit_date', type: 'date', nullable: true })
  visitDate?: Date | null;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 40,
    default: ReviewStatus.PENDING,
  })
  status!: ReviewStatus;

  @Column({ name: 'moderated_by', type: 'uuid', nullable: true })
  moderatedBy?: string | null;

  @Column({ name: 'moderated_at', type: 'datetime', nullable: true })
  moderatedAt?: Date | null;

  @Column({ name: 'moderation_notes', type: 'text', nullable: true })
  moderationNotes?: string | null;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[] | null;

  @Column({ name: 'metadata', type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;
}

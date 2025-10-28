import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { HomestayEntity } from './homestay.entity';
import { HomestayBookingEntity } from './homestay-booking.entity';
import { UserEntity } from '../users/user.entity';

export enum HomestayReviewStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
}

@Entity('homestay_reviews')
export class HomestayReviewEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => HomestayEntity, (homestay) => homestay.reviews, {
    onDelete: 'CASCADE',
  })
  homestay!: Relation<HomestayEntity>;

  @ManyToOne(() => HomestayBookingEntity, (booking) => booking.reviews, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  booking?: Relation<HomestayBookingEntity> | null;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  reviewer!: Relation<UserEntity>;

  @Column({
    type: 'varchar',
    length: 20,
    default: HomestayReviewStatus.PENDING,
  })
  status!: HomestayReviewStatus;

  @Column({ name: 'overall_rating', type: 'decimal', precision: 3, scale: 2 })
  overallRating!: number;

  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @Column({ type: 'boolean', default: false })
  isAnonymous!: boolean;
}

import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { HomestayEntity } from './homestay.entity';

export enum HomestayPricingRuleType {
  SEASONAL = 'seasonal',
  LAST_MINUTE = 'last_minute',
  EARLY_BIRD = 'early_bird',
  SPECIAL_EVENT = 'special_event',
}

export enum HomestayPricingRuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum HomestayPricingAdjustmentType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

@Entity('homestay_pricing_rules')
export class HomestayPricingRuleEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => HomestayEntity, (homestay) => homestay.pricingRules, {
    onDelete: 'CASCADE',
  })
  homestay!: Relation<HomestayEntity>;

  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: HomestayPricingRuleType.SEASONAL,
  })
  type!: HomestayPricingRuleType;

  @Column({
    type: 'varchar',
    length: 30,
    default: HomestayPricingRuleStatus.ACTIVE,
  })
  status!: HomestayPricingRuleStatus;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate!: Date;

  @Column({ name: 'start_time', type: 'varchar', length: 20, nullable: true })
  startTime?: string | null;

  @Column({ name: 'end_time', type: 'varchar', length: 20, nullable: true })
  endTime?: string | null;

  @Column({ name: 'days_of_week', type: 'simple-array', nullable: true })
  daysOfWeek?: number[] | null;

  @Column({ name: 'minimum_nights', type: 'int', nullable: true })
  minimumNights?: number | null;

  @Column({ name: 'maximum_nights', type: 'int', nullable: true })
  maximumNights?: number | null;

  @Column({ name: 'minimum_guests', type: 'int', nullable: true })
  minimumGuests?: number | null;

  @Column({ name: 'maximum_guests', type: 'int', nullable: true })
  maximumGuests?: number | null;

  @Column({
    name: 'price_adjustment_type',
    type: 'varchar',
    length: 20,
    default: HomestayPricingAdjustmentType.PERCENTAGE,
  })
  priceAdjustmentType!: HomestayPricingAdjustmentType;

  @Column({
    name: 'price_adjustment_value',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  priceAdjustmentValue!: number;

  @Column({
    name: 'new_base_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  newBasePrice?: number | null;

  @Column({ type: 'simple-json', nullable: true })
  conditions?: Record<string, any> | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @Column({ type: 'int', default: 0 })
  priority!: number;
}

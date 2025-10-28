import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';

export enum PromotionType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  PACKAGE = 'package',
  FLASH_SALE = 'flash_sale',
  EARLY_BIRD = 'early_bird',
  LAST_MINUTE = 'last_minute',
}

@Entity('promotions')
export class PromotionEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: PromotionType.PERCENTAGE,
  })
  type!: PromotionType;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'discount_value', type: 'decimal', precision: 12, scale: 2 })
  discountValue!: string;

  @Column({
    name: 'discount_currency',
    type: 'varchar',
    length: 5,
    default: 'VND',
  })
  discountCurrency!: string;

  @Column({
    name: 'min_spend',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  minSpend?: string | null;

  @Column({
    name: 'max_discount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  maxDiscount?: string | null;

  @Column({ name: 'start_date', type: 'datetime', nullable: true })
  startDate?: Date | null;

  @Column({ name: 'end_date', type: 'datetime', nullable: true })
  endDate?: Date | null;

  @Column({ name: 'stay_date_start', type: 'datetime', nullable: true })
  stayDateStart?: Date | null;

  @Column({ name: 'stay_date_end', type: 'datetime', nullable: true })
  stayDateEnd?: Date | null;

  @Column({ name: 'usage_limit', type: 'int', nullable: true })
  usageLimit?: number | null;

  @Column({ name: 'per_customer_limit', type: 'int', nullable: true })
  perCustomerLimit?: number | null;

  @Column({ name: 'used_count', type: 'int', default: 0 })
  usedCount!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'target_audiences', type: 'simple-array', nullable: true })
  targetAudiences?: string[] | null;

  @Column({ name: 'applies_to', type: 'simple-json', nullable: true })
  appliesTo?: {
    destinations?: string[];
    properties?: string[];
    experiences?: string[];
    restaurants?: string[];
    roomTypes?: string[];
  } | null;

  @Column({ name: 'terms_conditions', type: 'text', nullable: true })
  termsAndConditions?: string | null;

  @Column({ name: 'metadata', type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;
}

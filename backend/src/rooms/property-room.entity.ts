import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { PropertyEntity } from '../properties/property.entity';

export enum RoomStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  MAINTENANCE = 'maintenance',
  ARCHIVED = 'archived',
}

@Entity('property_rooms')
export class PropertyRoomEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'external_id', type: 'varchar', length: 120, nullable: true })
  externalId?: string | null;

  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  slug?: string | null;

  @Column({
    name: 'short_description',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  shortDescription?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'max_guests', type: 'int', default: 2 })
  maxGuests!: number;

  @Column({ name: 'bed_type', type: 'varchar', length: 120, nullable: true })
  bedType?: string | null;

  @Column({ name: 'size_sqm', type: 'float', nullable: true })
  sizeSquareMeters?: number | null;

  @Column({ name: 'base_price', type: 'decimal', precision: 12, scale: 2 })
  basePrice!: string;

  @Column({ type: 'varchar', length: 5, default: 'VND' })
  currency!: string;

  @Column({
    name: 'extra_person_fee',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  extraPersonFee?: string | null;

  @Column({ name: 'amenities', type: 'simple-array', nullable: true })
  amenities?: string[] | null;

  @Column({ name: 'image_ids', type: 'simple-json', nullable: true })
  imageIds?: string[] | null;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 40,
    default: RoomStatus.AVAILABLE,
  })
  status!: RoomStatus;

  @Column({ name: 'inventory_total', type: 'int', default: 0 })
  inventoryTotal!: number;

  @Column({ name: 'inventory_available', type: 'int', default: 0 })
  inventoryAvailable!: number;

  @Column({ name: 'metadata', type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @ManyToOne(() => PropertyEntity, (property) => property.rooms, {
    onDelete: 'CASCADE',
  })
  property!: PropertyEntity;
}

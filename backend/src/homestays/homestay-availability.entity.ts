import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { HomestayEntity } from './homestay.entity';
import { HomestayRoomEntity } from './homestay-room.entity';

export enum HomestayAvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  BLOCKED = 'blocked',
}

@Entity('homestay_availability')
export class HomestayAvailabilityEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => HomestayEntity, (homestay) => homestay.availability, {
    onDelete: 'CASCADE',
  })
  homestay!: Relation<HomestayEntity>;

  @ManyToOne(() => HomestayRoomEntity, (room) => room.availability, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  room?: Relation<HomestayRoomEntity> | null;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date | null;

  @Column({ name: 'available_units', type: 'int', default: 1 })
  availableUnits!: number;

  @Column({ name: 'booked_units', type: 'int', default: 0 })
  bookedUnits!: number;

  @Column({
    type: 'varchar',
    length: 30,
    default: HomestayAvailabilityStatus.AVAILABLE,
  })
  status!: HomestayAvailabilityStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes?: string | null;
}

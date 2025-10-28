import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { LocationType } from './location-type.enum';

@Entity('locations')
export class LocationEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'varchar', default: LocationType.CITY })
  type!: LocationType;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string | null;

  @ManyToOne(() => LocationEntity, (location) => location.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: LocationEntity | null;

  @OneToMany(() => LocationEntity, (location) => location.parent)
  children?: LocationEntity[];

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude?: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude?: number | null;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
}

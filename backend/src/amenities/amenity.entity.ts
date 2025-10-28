import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { AmenityCategory } from './amenity-category.enum';

@Entity('amenities')
export class AmenityEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column({ type: 'varchar', default: AmenityCategory.PROPERTY })
  category!: AmenityCategory;

  @Column({ type: 'varchar', length: 128, nullable: true })
  icon?: string | null;
}

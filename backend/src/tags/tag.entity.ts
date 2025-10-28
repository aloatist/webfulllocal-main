import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { TagType } from './tag-type.enum';

@Entity('tags')
export class TagEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  label!: string;

  @Column({ type: 'varchar', default: TagType.GENERIC })
  type!: TagType;
}

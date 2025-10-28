
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';

@Entity('homepage_banners')
export class HomepageBannerEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'image_url', type: 'varchar', length: 2048 })
  imageUrl!: string;

  @Column({ name: 'link_url', type: 'varchar', length: 2048, nullable: true })
  linkUrl?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  subtitle?: string | null;

  @Column({ type: 'int', default: 0 })
  order!: number;
}

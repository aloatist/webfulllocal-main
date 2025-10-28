import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('content')
@Unique(['key'])
export class ContentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  key!: string;

  @Column({ type: 'simple-json' })
  data!: Record<string, any>;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { CustomerEntity } from '../customers/customer.entity';
import { UserEntity } from '../users/user.entity';
import { LeadStatus } from './lead-status.enum';
import { LeadTopic } from './lead-topic.enum';

@Entity('leads')
export class LeadEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone?: string | null;

  @Column({ type: 'text', nullable: true })
  message?: string | null;

  @Column({ type: 'varchar', default: LeadTopic.GENERAL })
  topic!: LeadTopic;

  @Column({ type: 'varchar', default: LeadStatus.NEW })
  status!: LeadStatus;

  @ManyToOne(() => CustomerEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer?: CustomerEntity | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo?: UserEntity | null;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
}

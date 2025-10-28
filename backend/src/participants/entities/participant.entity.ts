import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../../common/entities/base.entity';
import { ParticipantStatus } from '../enums/participant-status.enum';
import { CheckinLogEntity } from '../../checkins/entities/checkin-log.entity';

@Entity('participants')
export class ParticipantEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_participants_code', { unique: true })
  @Column({ type: 'varchar', length: 64, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phoneNumber?: string | null;

  @Column({ type: 'varchar', default: ParticipantStatus.PENDING })
  status!: ParticipantStatus;

  @Column({ type: 'datetime', nullable: true })
  checkedInAt?: Date | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => CheckinLogEntity, (log) => log.participant)
  checkinLogs?: CheckinLogEntity[];
}

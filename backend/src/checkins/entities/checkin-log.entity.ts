import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../../common/entities/base.entity';
import { CheckinStatus } from '../enums/checkin-status.enum';
import { ParticipantEntity } from '../../participants/entities/participant.entity';

@Entity('checkin_logs')
export class CheckinLogEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(
    () => ParticipantEntity,
    (participant) => participant.checkinLogs,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'participant_id' })
  participant?: ParticipantEntity | null;

  @Index('idx_checkin_logs_status')
  @Column({ default: CheckinStatus.SUCCESS })
  status!: CheckinStatus;

  @Column({ type: 'varchar', length: 64, nullable: true })
  scannerId?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceInfo?: string | null;

  @Column({ length: 64 })
  scanCode!: string;

  @Column({ type: 'text', nullable: true })
  message?: string | null;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ParticipantEntity } from '../participants/entities/participant.entity';
import { ParticipantStatus } from '../participants/enums/participant-status.enum';
import { CheckinLogEntity } from './entities/checkin-log.entity';
import { ScanCheckinDto } from './dto/scan-checkin.dto';
import { CheckinStatus } from './enums/checkin-status.enum';
import { CheckinResponseDto } from './dto/checkin-response.dto';

export interface ParticipantView {
  id: string;
  fullName: string;
  code: string;
  status: ParticipantStatus;
  checkedInAt: Date | null;
}

export interface CheckinLogView {
  id: string;
  status: CheckinStatus;
  scanCode: string;
  message?: string | null;
  scannerId?: string | null;
  deviceInfo?: string | null;
  createdAt: Date;
  participant?: ParticipantView | null;
}

export interface CheckinsStats {
  total: number;
  byStatus: Record<CheckinStatus, number>;
}

@Injectable()
export class CheckinsService {
  private readonly supportsPessimisticLock: boolean;

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CheckinLogEntity)
    private readonly checkinLogRepository: Repository<CheckinLogEntity>,
  ) {
    const driverType =
      (this.dataSource.options as { type?: string })?.type ?? '';
    const unsupportedDrivers = [
      'sqlite',
      'better-sqlite3',
      'cordova',
      'capacitor',
      'expo',
    ];
    this.supportsPessimisticLock = !unsupportedDrivers.includes(driverType);
  }

  async processScan(dto: ScanCheckinDto): Promise<CheckinResponseDto> {
    const normalizedCode = dto.code.trim().toUpperCase();
    const scannedAt = new Date();

    return this.dataSource.transaction(async (manager) => {
      let participant: ParticipantEntity | null;

      if (this.supportsPessimisticLock) {
        participant = await manager
          .getRepository(ParticipantEntity)
          .createQueryBuilder('participant')
          .setLock('pessimistic_write')
          .where('participant.code = :code', { code: normalizedCode })
          .getOne();
      } else {
        participant = await manager.findOne(ParticipantEntity, {
          where: { code: normalizedCode },
        });
      }

      if (!participant) {
        await manager.save(
          manager.create(CheckinLogEntity, {
            status: CheckinStatus.INVALID,
            scanCode: normalizedCode,
            message: 'Participant not found',
            scannerId: dto.scannerId,
            deviceInfo: dto.deviceInfo,
          }),
        );

        return {
          status: CheckinStatus.INVALID,
          message: 'Mã không tồn tại trong hệ thống',
          scannedAt,
        } satisfies CheckinResponseDto;
      }

      if (participant.status === ParticipantStatus.CHECKED_IN) {
        await manager.save(
          manager.create(CheckinLogEntity, {
            participant,
            status: CheckinStatus.DUPLICATE,
            scanCode: normalizedCode,
            message: 'Participant already checked in',
            scannerId: dto.scannerId,
            deviceInfo: dto.deviceInfo,
          }),
        );

        return {
          status: CheckinStatus.DUPLICATE,
          message: 'Người tham gia đã điểm danh trước đó',
          scannedAt,
          participant: this.mapParticipant(participant),
        } satisfies CheckinResponseDto;
      }

      participant.status = ParticipantStatus.CHECKED_IN;
      participant.checkedInAt = scannedAt;
      await manager.save(participant);

      await manager.save(
        manager.create(CheckinLogEntity, {
          participant,
          status: CheckinStatus.SUCCESS,
          scanCode: normalizedCode,
          scannerId: dto.scannerId,
          deviceInfo: dto.deviceInfo,
        }),
      );

      return {
        status: CheckinStatus.SUCCESS,
        message: 'Điểm danh thành công',
        scannedAt,
        participant: this.mapParticipant(participant),
      } satisfies CheckinResponseDto;
    });
  }

  async findRecent(limit = 20): Promise<CheckinLogView[]> {
    const logs = await this.checkinLogRepository.find({
      relations: ['participant'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return logs.map((log) => this.mapLog(log));
  }

  async stats(): Promise<CheckinsStats> {
    const qb = this.checkinLogRepository
      .createQueryBuilder('log')
      .select('log.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.status');

    const rows = await qb.getRawMany<{
      status: CheckinStatus;
      count: string;
    }>();

    const byStatus: Record<CheckinStatus, number> = {
      [CheckinStatus.SUCCESS]: 0,
      [CheckinStatus.DUPLICATE]: 0,
      [CheckinStatus.INVALID]: 0,
    };

    let total = 0;
    for (const row of rows) {
      const count = Number(row.count) || 0;
      total += count;
      if (row.status in byStatus) {
        byStatus[row.status] = count;
      }
    }

    return { total, byStatus };
  }

  async resetAll(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .update(ParticipantEntity)
        .set({
          status: ParticipantStatus.PENDING,
          checkedInAt: null,
        })
        .execute();

      await manager
        .createQueryBuilder()
        .delete()
        .from(CheckinLogEntity)
        .execute();
    });
  }

  private mapParticipant(participant: ParticipantEntity): ParticipantView {
    return {
      id: participant.id,
      fullName: participant.fullName,
      code: participant.code,
      status: participant.status,
      checkedInAt: participant.checkedInAt ?? null,
    };
  }

  private mapLog(log: CheckinLogEntity): CheckinLogView {
    return {
      id: log.id,
      status: log.status,
      scanCode: log.scanCode,
      message: log.message ?? null,
      scannerId: log.scannerId ?? null,
      deviceInfo: log.deviceInfo ?? null,
      createdAt: log.createdAt,
      participant: log.participant
        ? this.mapParticipant(log.participant)
        : null,
    };
  }
}

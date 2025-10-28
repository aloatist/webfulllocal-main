import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { ParticipantStatus } from './enums/participant-status.enum';
import { ParticipantEntity } from './entities/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ListParticipantsDto } from './dto/list-participants.dto';

export interface ParticipantsStats {
  total: number;
  checkedIn: number;
  pending: number;
}

const SEARCHABLE_COLUMNS = [
  'fullName',
  'code',
  'email',
  'phoneNumber',
] as const;

@Injectable()
export class ParticipantsService {
  private readonly logger = new Logger(ParticipantsService.name);

  constructor(
    @InjectRepository(ParticipantEntity)
    private readonly participantsRepository: Repository<ParticipantEntity>,
  ) {}

  async create(
    createParticipantDto: CreateParticipantDto,
  ): Promise<ParticipantEntity> {
    const participant = this.participantsRepository.create({
      ...createParticipantDto,
      code: await this.resolveCode(createParticipantDto.code),
      fullName: createParticipantDto.fullName.trim(),
    });

    return this.participantsRepository.save(participant);
  }

  async import(records: CreateParticipantDto[]): Promise<ParticipantEntity[]> {
    if (!records?.length) {
      return [];
    }

    return this.participantsRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(ParticipantEntity);
      const items: ParticipantEntity[] = [];

      for (const record of records) {
        try {
          const normalizedName = record.fullName?.trim();
          const incomingCode = record.code?.trim().toUpperCase();

          let participant: ParticipantEntity | null = null;

          if (incomingCode) {
            participant = await repo.findOne({ where: { code: incomingCode } });
          }

          if (participant) {
            if (normalizedName) {
              participant.fullName = normalizedName;
            }
            if (record.email !== undefined) {
              participant.email = record.email ?? null;
            }
            if (record.phoneNumber !== undefined) {
              participant.phoneNumber = record.phoneNumber ?? null;
            }
            if (record.metadata !== undefined) {
              participant.metadata = record.metadata ?? null;
            }

            participant = await repo.save(participant);
            items.push(participant);
            continue;
          }

          const entity = repo.create({
            ...record,
            fullName: normalizedName ?? record.fullName,
            code: await this.resolveCode(incomingCode ?? undefined),
          });

          const created = await repo.save(entity);
          items.push(created);
        } catch (error) {
          this.logger.error(
            `Failed to import participant ${record.fullName}`,
            error instanceof Error ? error.stack : error,
          );
          throw error;
        }
      }

      return items;
    });
  }

  async update(
    id: string,
    dto: UpdateParticipantDto,
  ): Promise<ParticipantEntity> {
    const participant = await this.participantsRepository.findOneOrFail({
      where: { id },
    });
    Object.assign(participant, dto);
    if (dto.code) {
      participant.code = await this.resolveCode(dto.code, participant.id);
    }
    return this.participantsRepository.save(participant);
  }

  async list(query: ListParticipantsDto) {
    const { page = 1, limit = 20, status, search } = query;
    const qb = this.participantsRepository
      .createQueryBuilder('participant')
      .orderBy('participant.fullName', 'ASC');

    if (status) {
      qb.andWhere('participant.status = :status', { status });
    }

    if (search) {
      const normalized = `%${search.toLowerCase()}%`;
      const whereClauses: string[] = [];
      const params: Record<string, unknown> = {};

      SEARCHABLE_COLUMNS.forEach((column, index) => {
        const key = `search${index}`;
        whereClauses.push(`LOWER(participant.${column}) LIKE :${key}`);
        params[key] = normalized;
      });

      qb.andWhere(`(${whereClauses.join(' OR ')})`, params);
    }

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: items,
    };
  }

  async findById(id: string): Promise<ParticipantEntity | null> {
    return this.participantsRepository.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<ParticipantEntity | null> {
    return this.participantsRepository.findOne({ where: { code } });
  }

  async resetCheckin(id: string): Promise<ParticipantEntity> {
    const participant = await this.participantsRepository.findOneOrFail({
      where: { id },
    });
    participant.status = ParticipantStatus.PENDING;
    participant.checkedInAt = null;
    return this.participantsRepository.save(participant);
  }

  async stats(): Promise<ParticipantsStats> {
    const total = await this.participantsRepository.count();
    const checkedIn = await this.participantsRepository.count({
      where: { status: ParticipantStatus.CHECKED_IN },
    });

    return {
      total,
      checkedIn,
      pending: total - checkedIn,
    };
  }

  private async resolveCode(
    code?: string,
    idToExclude?: string,
  ): Promise<string> {
    const normalized = (code ?? this.generateCode()).trim().toUpperCase();

    const existing = await this.participantsRepository.findOne({
      where: { code: normalized },
    });
    if (!existing || existing.id === idToExclude) {
      return normalized;
    }

    return this.resolveCode(this.generateCode(), idToExclude);
  }

  private generateCode(): string {
    return randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
  }
}

import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ParticipantStatus } from '../enums/participant-status.enum';

export class ListParticipantsDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ParticipantStatus)
  status?: ParticipantStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  search?: string;
}

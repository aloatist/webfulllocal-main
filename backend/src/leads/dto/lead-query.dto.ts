import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { LeadStatus } from '../lead-status.enum';
import { LeadTopic } from '../lead-topic.enum';

export class LeadQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsEnum(LeadTopic)
  topic?: LeadTopic;

  @IsOptional()
  @IsString()
  assignedToId?: string;
}

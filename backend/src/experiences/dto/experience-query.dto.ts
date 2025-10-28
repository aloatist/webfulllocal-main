import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ExperienceCategory, ExperienceStatus } from '../experience.entity';

export class ExperienceQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ExperienceCategory)
  category?: ExperienceCategory;

  @IsOptional()
  @IsEnum(ExperienceStatus)
  status?: ExperienceStatus;

  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;
}

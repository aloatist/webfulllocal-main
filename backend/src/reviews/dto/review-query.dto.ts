import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReviewStatus, ReviewTargetType } from '../review.entity';

export class ReviewQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ReviewTargetType)
  targetType?: ReviewTargetType;

  @IsOptional()
  @IsUUID()
  targetId?: string;

  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;
}

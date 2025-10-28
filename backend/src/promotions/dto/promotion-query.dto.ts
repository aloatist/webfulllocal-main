import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PromotionType } from '../promotion.entity';

export class PromotionQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PromotionType)
  type?: PromotionType;

  @IsOptional()
  @IsString()
  status?: 'active' | 'upcoming' | 'expired';
}

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { DestinationType } from '../destination.entity';

export class DestinationQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(DestinationType)
  type?: DestinationType;

  @IsOptional()
  @IsBooleanString()
  featured?: string;
}

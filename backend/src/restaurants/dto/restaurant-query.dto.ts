import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  RestaurantPriceLevel,
  RestaurantStatus,
  RestaurantType,
} from '../restaurant.entity';

export class RestaurantQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(RestaurantType)
  type?: RestaurantType;

  @IsOptional()
  @IsEnum(RestaurantPriceLevel)
  priceLevel?: RestaurantPriceLevel;

  @IsOptional()
  @IsEnum(RestaurantStatus)
  status?: RestaurantStatus;

  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;
}

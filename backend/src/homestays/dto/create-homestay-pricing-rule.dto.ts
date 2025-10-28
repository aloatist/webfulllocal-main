import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  HomestayPricingAdjustmentType,
  HomestayPricingRuleStatus,
  HomestayPricingRuleType,
} from '../homestay-pricing-rule.entity';

export class CreateHomestayPricingRuleDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEnum(HomestayPricingRuleType)
  type?: HomestayPricingRuleType;

  @IsOptional()
  @IsEnum(HomestayPricingRuleStatus)
  status?: HomestayPricingRuleStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  daysOfWeek?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minimumNights?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maximumNights?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minimumGuests?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maximumGuests?: number;

  @IsOptional()
  @IsEnum(HomestayPricingAdjustmentType)
  priceAdjustmentType?: HomestayPricingAdjustmentType;

  @Type(() => Number)
  @IsNumber()
  priceAdjustmentValue!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  newBasePrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

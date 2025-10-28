import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PromotionType } from '../promotion.entity';

export class CreatePromotionDto {
  @IsString()
  @Length(2, 120)
  code!: string;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsEnum(PromotionType)
  type?: PromotionType;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue!: number;

  @IsOptional()
  @IsString()
  @Length(3, 5)
  discountCurrency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minSpend?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsDateString()
  stayDateStart?: string;

  @IsOptional()
  @IsDateString()
  stayDateEnd?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  perCustomerLimit?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetAudiences?: string[];

  @IsOptional()
  @IsObject()
  appliesTo?: {
    destinations?: string[];
    properties?: string[];
    experiences?: string[];
    restaurants?: string[];
    roomTypes?: string[];
  };

  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

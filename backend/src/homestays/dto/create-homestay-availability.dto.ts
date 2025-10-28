import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { HomestayAvailabilityStatus } from '../homestay-availability.entity';

export class CreateHomestayAvailabilityDto {
  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  availableUnits?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bookedUnits?: number;

  @IsOptional()
  @IsEnum(HomestayAvailabilityStatus)
  status?: HomestayAvailabilityStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  roomId?: string;
}


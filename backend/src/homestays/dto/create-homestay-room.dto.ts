import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { HomestayRoomStatus } from '../homestay-room.entity';

export class CreateHomestayRoomDto {
  @IsString()
  @Length(2, 180)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(2, 180)
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeSqm?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxGuests?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bedTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsEnum(HomestayRoomStatus)
  status?: HomestayRoomStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  heroImageUrl?: string;

  @IsOptional()
  @IsUUID()
  id?: string;
}


import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from '../property-room.entity';

export class CreateRoomDto {
  @IsUUID()
  propertyId!: string;

  @IsString()
  @Length(2, 180)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxGuests?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  bedType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sizeSquareMeters?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsOptional()
  @IsString()
  @Length(3, 5)
  currency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  extraPersonFee?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  imageIds?: string[];

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  inventoryTotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  inventoryAvailable?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

import {
  IsArray,
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ExperienceCategory,
  ExperienceDifficulty,
  ExperienceStatus,
} from '../experience.entity';

export class CreateExperienceDto {
  @IsString()
  @Length(2, 180)
  title!: string;

  @IsString()
  @Length(2, 180)
  slug!: string;

  @IsOptional()
  @IsEnum(ExperienceCategory)
  category?: ExperienceCategory;

  @IsOptional()
  @IsEnum(ExperienceDifficulty)
  difficulty?: ExperienceDifficulty;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlightPoints?: string[];

  @IsOptional()
  @IsUUID()
  heroImageId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  galleryImageIds?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  durationHours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  groupSizeMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  groupSizeMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFrom?: number;

  @IsOptional()
  @IsString()
  @Length(3, 5)
  currency?: string;

  @IsOptional()
  @IsObject()
  availabilitySchedule?: Record<string, any>;

  @IsOptional()
  @IsArray()
  itinerary?: Array<{
    title: string;
    description?: string;
    duration?: string;
  }>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  meetingPoint?: string;

  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactPhone?: string;

  @IsOptional()
  @IsEnum(ExperienceStatus)
  status?: ExperienceStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;
}

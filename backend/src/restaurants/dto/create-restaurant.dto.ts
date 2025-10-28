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
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  RestaurantPriceLevel,
  RestaurantStatus,
  RestaurantType,
} from '../restaurant.entity';

export class CreateRestaurantDto {
  @IsString()
  @Length(2, 180)
  name!: string;

  @IsString()
  @Length(2, 180)
  slug!: string;

  @IsOptional()
  @IsEnum(RestaurantType)
  type?: RestaurantType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisineTypes?: string[];

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
  @IsUUID()
  heroImageId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  galleryImageIds?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  averagePrice?: number;

  @IsOptional()
  @IsString()
  @Length(3, 5)
  currency?: string;

  @IsOptional()
  @IsEnum(RestaurantPriceLevel)
  priceLevel?: RestaurantPriceLevel;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reservationUrl?: string;

  @IsString()
  @MaxLength(255)
  addressLine1!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string;

  @IsString()
  @MaxLength(120)
  country!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  postalCode?: string;

  @IsOptional()
  @IsObject()
  openingHours?: Record<string, any>;

  @IsOptional()
  menu?: Array<{
    section: string;
    description?: string;
    items: Array<{
      name: string;
      description?: string;
      price?: number;
      currency?: string;
      tags?: string[];
    }>;
  }>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryOptions?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

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

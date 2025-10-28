import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AmenityCategory } from '../amenity-category.enum';

export class CreateAmenityDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsEnum(AmenityCategory)
  category?: AmenityCategory;

  @IsOptional()
  @IsString()
  icon?: string;
}

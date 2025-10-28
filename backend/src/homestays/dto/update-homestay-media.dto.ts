import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateHomestayMediaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  heroImageUrl?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImageUrls?: string[];
}


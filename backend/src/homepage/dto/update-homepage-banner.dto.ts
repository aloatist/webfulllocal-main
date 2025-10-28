
import { IsInt, IsOptional, IsUrl, IsString } from 'class-validator';

export class UpdateHomepageBannerDto {
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  linkUrl?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsInt()
  @IsOptional()
  order?: number;
}

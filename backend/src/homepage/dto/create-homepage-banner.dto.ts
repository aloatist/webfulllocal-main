
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateHomepageBannerDto {
  @IsUrl()
  @IsNotEmpty()
  imageUrl!: string;

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

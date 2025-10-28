import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUploadDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  originalName?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}

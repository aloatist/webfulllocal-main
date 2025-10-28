import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class ScanCheckinDto {
  @IsString()
  @Length(4, 64)
  @Transform(({ value }) => value?.trim())
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  scannerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  deviceInfo?: string;
}

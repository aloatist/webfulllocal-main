import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  @MaxLength(255)
  fullName!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 32)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phoneNumber?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

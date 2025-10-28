import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ReviewStatus, ReviewTargetType } from '../review.entity';

export class CreateReviewDto {
  @IsEnum(ReviewTargetType)
  targetType!: ReviewTargetType;

  @IsUUID()
  targetId!: string;

  @IsString()
  @Length(2, 255)
  targetName!: string;

  @IsString()
  @Length(2, 255)
  authorName!: string;

  @IsOptional()
  @IsEmail()
  authorEmail?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  authorCountry?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsDateString()
  visitDate?: string;

  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @IsOptional()
  @IsString()
  moderationNotes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  metadata?: Record<string, any>;
}

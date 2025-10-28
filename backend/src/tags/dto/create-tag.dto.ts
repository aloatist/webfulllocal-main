import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TagType } from '../tag-type.enum';

export class CreateTagDto {
  @IsString()
  slug!: string;

  @IsString()
  label!: string;

  @IsOptional()
  @IsEnum(TagType)
  type?: TagType;
}

import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateHomestayAvailabilityDto } from './create-homestay-availability.dto';

export class CreateHomestayAvailabilityBulkDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateHomestayAvailabilityDto)
  items!: CreateHomestayAvailabilityDto[];
}


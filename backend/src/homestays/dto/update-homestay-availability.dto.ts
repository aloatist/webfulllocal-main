import { PartialType } from '@nestjs/mapped-types';
import { CreateHomestayAvailabilityDto } from './create-homestay-availability.dto';

export class UpdateHomestayAvailabilityDto extends PartialType(
  CreateHomestayAvailabilityDto,
) {}


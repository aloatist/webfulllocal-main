import { IsOptional, IsUUID } from 'class-validator';
import { UpdateHomestayDto } from './update-homestay.dto';

export class AdminUpdateHomestayDto extends UpdateHomestayDto {
  @IsOptional()
  @IsUUID()
  hostId?: string;
}

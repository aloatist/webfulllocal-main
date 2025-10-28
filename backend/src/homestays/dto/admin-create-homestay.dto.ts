import { IsOptional, IsUUID } from 'class-validator';
import { CreateHomestayDto } from './create-homestay.dto';

export class AdminCreateHomestayDto extends CreateHomestayDto {
  @IsOptional()
  @IsUUID()
  hostId?: string;
}

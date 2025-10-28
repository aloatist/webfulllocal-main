import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { RoomStatus } from '../property-room.entity';

export class RoomQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}

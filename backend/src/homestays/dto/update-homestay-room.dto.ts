import { PartialType } from '@nestjs/mapped-types';
import { CreateHomestayRoomDto } from './create-homestay-room.dto';

export class UpdateHomestayRoomDto extends PartialType(CreateHomestayRoomDto) {}


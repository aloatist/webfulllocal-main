import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class HomestayBulkActionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  ids!: string[];
}


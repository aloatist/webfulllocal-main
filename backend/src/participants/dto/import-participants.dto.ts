import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateParticipantDto } from './create-participant.dto';

export class ImportParticipantsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateParticipantDto)
  records!: CreateParticipantDto[];
}

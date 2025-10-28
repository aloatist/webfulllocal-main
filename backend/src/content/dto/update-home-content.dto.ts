import { IsObject } from 'class-validator';
import type { HomeContent } from '../types';
import { UpdateContentDto } from './update-content.dto';

export class UpdateHomeContentDto extends UpdateContentDto {
  @IsObject()
  declare data: HomeContent;
}

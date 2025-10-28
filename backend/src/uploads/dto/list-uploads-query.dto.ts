import { IsIn, IsOptional } from 'class-validator';

export class ListUploadsQueryDto {
  @IsOptional()
  @IsIn(['all', 'public', 'private'])
  visibility?: 'all' | 'public' | 'private';
}

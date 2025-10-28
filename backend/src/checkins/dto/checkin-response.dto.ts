import { CheckinStatus } from '../enums/checkin-status.enum';

export class CheckinResponseDto {
  status!: CheckinStatus;
  message?: string;
  participant?: {
    id: string;
    fullName: string;
    code: string;
    status: string;
    checkedInAt: Date | null;
  };
  scannedAt!: Date;
}

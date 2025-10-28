import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  BookingPaymentStatus,
  BookingSource,
  BookingStatus,
  BookingType,
} from '../booking.entity';

export class CreateBookingDto {
  @IsString()
  @Length(4, 60)
  referenceCode!: string;

  @IsOptional()
  @IsEnum(BookingType)
  type?: BookingType;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(BookingSource)
  source?: BookingSource;

  @IsString()
  @MaxLength(180)
  customerName!: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  customerCountry?: string;

  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  adultCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  childCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  infantCount?: number;

  @Type(() => Number)
  @Min(0)
  totalAmount!: number;

  @IsOptional()
  @IsString()
  @Length(3, 5)
  currency?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  depositAmount?: number;

  @IsOptional()
  @IsEnum(BookingPaymentStatus)
  paymentStatus?: BookingPaymentStatus;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  internalNotes?: string;

  @IsOptional()
  @IsUUID()
  assignedStaffId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  roomId?: string;

  @IsOptional()
  @IsUUID()
  experienceId?: string;

  @IsOptional()
  @IsUUID()
  restaurantId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;
}

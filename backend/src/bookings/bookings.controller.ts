import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { BookingsService } from './bookings.service';
import { BookingQueryDto } from './dto/booking-query.dto';
import { presentBooking } from './booking.presenter';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Permissions('booking.read')
  async findAll(@Query() query: BookingQueryDto) {
    const { data, total } = await this.bookingsService.findAll(query);
    return {
      data: data.map(presentBooking),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('booking.read')
  async findOne(@Param('id') id: string) {
    const booking = await this.bookingsService.findById(id);
    return presentBooking(booking);
  }

  @Post()
  @Permissions('booking.write')
  async create(@Body() dto: CreateBookingDto) {
    const booking = await this.bookingsService.create(dto);
    return presentBooking(booking);
  }

  @Patch(':id')
  @Permissions('booking.write')
  async update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    const booking = await this.bookingsService.update(id, dto);
    return presentBooking(booking);
  }

  @Delete(':id')
  @Permissions('booking.write')
  async remove(@Param('id') id: string) {
    await this.bookingsService.remove(id);
    return { success: true };
  }
}

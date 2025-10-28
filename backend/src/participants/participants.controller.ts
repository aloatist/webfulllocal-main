import {
  Body,
  Controller,
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
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { ImportParticipantsDto } from './dto/import-participants.dto';
import { ListParticipantsDto } from './dto/list-participants.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Get()
  @Permissions('attendance.participants.read')
  list(@Query() query: ListParticipantsDto) {
    return this.participantsService.list(query);
  }

  @Get('stats/summary')
  @Permissions('attendance.reports.read')
  summary() {
    return this.participantsService.stats();
  }

  @Get(':id')
  @Permissions('attendance.participants.read')
  findOne(@Param('id') id: string) {
    return this.participantsService.findById(id);
  }

  @Post()
  @Permissions('attendance.participants.write')
  create(@Body() dto: CreateParticipantDto) {
    return this.participantsService.create(dto);
  }

  @Post('import')
  @Permissions('attendance.participants.write')
  import(@Body() dto: ImportParticipantsDto) {
    return this.participantsService.import(dto.records);
  }

  @Patch(':id')
  @Permissions('attendance.participants.write')
  update(@Param('id') id: string, @Body() dto: UpdateParticipantDto) {
    return this.participantsService.update(id, dto);
  }

  @Patch(':id/reset')
  @Permissions('attendance.participants.write')
  reset(@Param('id') id: string) {
    return this.participantsService.resetCheckin(id);
  }
}

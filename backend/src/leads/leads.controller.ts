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
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsService } from './leads.service';
import { LeadStatus } from './lead-status.enum';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @Permissions('customer.read')
  findAll(@Query() query: LeadQueryDto) {
    return this.leadsService.findAll(query);
  }

  @Get(':id')
  @Permissions('customer.read')
  findOne(@Param('id') id: string) {
    return this.leadsService.findById(id);
  }

  @Post()
  @Permissions('customer.write')
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Patch(':id')
  @Permissions('customer.write')
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Post(':id/assign/:userId')
  @Permissions('customer.write')
  assign(@Param('id') id: string, @Param('userId') userId: string) {
    return this.leadsService.assignLead(id, userId);
  }

  @Post(':id/status')
  @Permissions('customer.write')
  changeStatus(@Param('id') id: string, @Body('status') status: LeadStatus) {
    return this.leadsService.changeStatus(id, status);
  }

  @Delete(':id')
  @Permissions('customer.write')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}

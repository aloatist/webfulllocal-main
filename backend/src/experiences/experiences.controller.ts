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
import { ExperiencesService } from './experiences.service';
import { ExperienceQueryDto } from './dto/experience-query.dto';
import { presentExperience } from './experience.presenter';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  @Permissions('experience.read')
  async findAll(@Query() query: ExperienceQueryDto) {
    const { data, total } = await this.experiencesService.findAll(query);
    return {
      data: data.map(presentExperience),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('experience.read')
  async findOne(@Param('id') id: string) {
    const experience = await this.experiencesService.findById(id);
    return presentExperience(experience);
  }

  @Post()
  @Permissions('experience.write')
  async create(@Body() dto: CreateExperienceDto) {
    const experience = await this.experiencesService.create(dto);
    return presentExperience(experience);
  }

  @Patch(':id')
  @Permissions('experience.write')
  async update(@Param('id') id: string, @Body() dto: UpdateExperienceDto) {
    const experience = await this.experiencesService.update(id, dto);
    return presentExperience(experience);
  }

  @Delete(':id')
  @Permissions('experience.write')
  async remove(@Param('id') id: string) {
    await this.experiencesService.remove(id);
    return { success: true };
  }
}

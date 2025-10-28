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
import { CreateTagDto } from './dto/create-tag.dto';
import { TagQueryDto } from './dto/tag-query.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @Permissions('catalog.read')
  findAll(@Query() query: TagQueryDto) {
    return this.tagsService.findAll(query);
  }

  @Get(':id')
  @Permissions('catalog.read')
  findOne(@Param('id') id: string) {
    return this.tagsService.findById(id);
  }

  @Post()
  @Permissions('catalog.write')
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Patch(':id')
  @Permissions('catalog.write')
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('catalog.write')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}

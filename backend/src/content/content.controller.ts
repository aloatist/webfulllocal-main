import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ContentService } from './content.service';
import { UpdateContentDto } from './dto/update-content.dto';
import { UpdateHomeContentDto } from './dto/update-home-content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('home')
  getHome() {
    return this.contentService.getHome();
  }

  @Put('home')
  updateHome(@Body() dto: UpdateHomeContentDto) {
    return this.contentService.updateHome(dto.data);
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.contentService.findOne(key);
  }

  @Put(':key')
  update(@Param('key') key: string, @Body() dto: UpdateContentDto) {
    return this.contentService.update(key, dto);
  }
}

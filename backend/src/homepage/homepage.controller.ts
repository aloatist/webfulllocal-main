import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { CreateHomepageBannerDto } from './dto/create-homepage-banner.dto';
import { UpdateHomepageBannerDto } from './dto/update-homepage-banner.dto';

@Controller('homepage/banners')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  findAll() {
    return this.homepageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homepageService.findOne(id);
  }

  @Post()
  create(@Body() createHomepageBannerDto: CreateHomepageBannerDto) {
    return this.homepageService.create(createHomepageBannerDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHomepageBannerDto: UpdateHomepageBannerDto,
  ) {
    return this.homepageService.update(id, updateHomepageBannerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homepageService.remove(id);
  }
}

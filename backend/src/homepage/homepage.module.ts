import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomepageController } from './homepage.controller';
import { HomepageService } from './homepage.service';
import { HomepageBannerEntity } from './homepage-banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HomepageBannerEntity])],
  controllers: [HomepageController],
  providers: [HomepageService],
})
export class HomepageModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceEntity } from './experience.entity';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyEntity } from '../properties/property.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExperienceEntity,
      DestinationEntity,
      PropertyEntity,
    ]),
  ],
  providers: [ExperiencesService],
  controllers: [ExperiencesController],
  exports: [ExperiencesService],
})
export class ExperiencesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { ParticipantEntity } from './entities/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantEntity])],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService, TypeOrmModule],
})
export class ParticipantsModule {}

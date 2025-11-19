import { Module } from '@nestjs/common';

import { TournamentsController } from './tournament.controller';
import { TournamentsRepository } from './tournament.repository';
import { TournamentService } from './tournament.service';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentService, TournamentsRepository],
})
export class TournamentsModule {}

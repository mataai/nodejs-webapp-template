import { Controller, Get } from '@nestjs/common';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';

import { TournamentDTO } from '@webapp-template/tournament-contracts';

import { TournamentService } from './tournament.service';

@ApiTags('tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private _tournamentService: TournamentService) {}
  @Get()
  @ApiAcceptedResponse({
    description: 'This action returns all tournaments',
    type: TournamentDTO,
  })
  public findAll(): TournamentDTO[] {
    return this._tournamentService.findAll();
  }

  @Get(':id')
  public findOne(): string {
    return 'This action returns a #${id} cat';
  }
}

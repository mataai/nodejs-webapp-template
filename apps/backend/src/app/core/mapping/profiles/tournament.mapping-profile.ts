import { Injectable } from '@nestjs/common';

import type { Mapper } from '@automapper/core';
import { createMap, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { Tournament } from '@webapp-template/database';
import { TournamentDTO } from '@webapp-template/tournament-contracts';

@Injectable()
export class TournamentsMappingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  public override get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      createMap(mapper, Tournament, TournamentDTO);
      createMap(mapper, TournamentDTO, Tournament);
    };
  }
}

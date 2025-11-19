import { Injectable } from '@nestjs/common';

import type { Mapper } from '@automapper/core';
import {
  createMap,
  forMember,
  mapFrom,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { GroupBaseDTO, GroupDTO } from '@webapp-template/auth-contracts';
import { Group } from '@webapp-template/database';

@Injectable()
export class GroupsMappingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  public override get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      createMap(
        mapper,
        Group,
        GroupBaseDTO,
        forMember(
          (d) => d.memberCount,
          mapFrom((s) => s.members.length),
        ),
      );
      createMap(
        mapper,
        Group,
        GroupDTO,
        forMember(
          (d) => d.members,
          mapFrom((s) => s.members),
        ),
        forMember(
          (d) => d.permissions,
          mapFrom((s) => s.permissions),
        ),
      );
      createMap(mapper, GroupDTO, Group);
    };
  }
}

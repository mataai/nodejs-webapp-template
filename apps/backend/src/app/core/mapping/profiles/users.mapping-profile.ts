import { Injectable } from '@nestjs/common';

import type { Mapper } from '@automapper/core';
import {
  createMap,
  forMember,
  MappingProfile,
  mapWith,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { GroupDTO, UserDTO } from '@webapp-template/auth-contracts';
import { Group, User } from '@webapp-template/database';

@Injectable()
export class UserMappingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  public override get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      createMap(
        mapper,
        User,
        UserDTO,
        forMember(
          (destination) => destination.groups,
          mapWith(GroupDTO, Group, (source) => source.groups),
        ),
      );
      createMap(
        mapper,
        UserDTO,
        User,
        forMember(
          (dest) => dest.groups,
          mapWith(Group, GroupDTO, (source) => source.groups),
        ),
      );
    };
  }
}

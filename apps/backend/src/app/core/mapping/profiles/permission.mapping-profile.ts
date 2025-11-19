import { Injectable } from '@nestjs/common';

import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { PermissionDTO } from '@webapp-template/auth-contracts';
import { Permission } from '@webapp-template/database';

@Injectable()
export class PermissionsMappingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  public override get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      createMap(mapper, Permission, PermissionDTO);
      createMap(mapper, PermissionDTO, Permission);
    };
  }
}

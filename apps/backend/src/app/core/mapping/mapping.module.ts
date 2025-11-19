import { DynamicModule, Module } from '@nestjs/common';

import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';

import { GroupsMappingProfile } from './profiles/group.mapping-profile';
import { PermissionsMappingProfile } from './profiles/permission.mapping-profile';
import { UserMappingProfile } from './profiles/users.mapping-profile';

@Module({
  imports: [AutomapperModule],
  providers: [
    UserMappingProfile,
    PermissionsMappingProfile,
    GroupsMappingProfile,
  ],
  exports: [
    UserMappingProfile,
    PermissionsMappingProfile,
    GroupsMappingProfile,
  ],
})
export class MappingModule {
  public static forRoot(): DynamicModule {
    return {
      module: MappingModule,
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    };
  }
}

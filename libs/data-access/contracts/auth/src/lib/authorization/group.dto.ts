import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { Group, User } from '@webapp-template/database';

import { UserBaseDTO } from '../users';
import { PermissionIdentifier } from './permission-identifier.dto';
import { PermissionDTO } from './premission.dto';

export class GroupBaseDTO {
  @ApiProperty()
  @AutoMap()
  public id!: Group['id'];
  @ApiProperty()
  @AutoMap()
  public name!: string;
  @ApiProperty()
  @AutoMap()
  public description!: string;
  @ApiProperty()
  @AutoMap()
  public memberCount!: number;
}

export class GroupDTO extends GroupBaseDTO {
  @ApiProperty()
  @AutoMap()
  public declare memberCount: never;
  @ApiProperty()
  @AutoMap()
  public members!: UserBaseDTO[];
  @ApiProperty()
  @AutoMap()
  public permissions!: PermissionDTO[];
}

export class GroupCreateRequestDTO {
  @ApiProperty()
  @AutoMap()
  public name!: string;
  @ApiProperty()
  @AutoMap()
  public description!: string;
  @ApiProperty({
    uniqueItems: true,
    isArray: true,
    nullable: true,
  })
  @AutoMap()
  public permissions?: PermissionIdentifier[];
}

export class GroupUpdateRequestDTO {
  @ApiProperty()
  @AutoMap()
  public description?: string;
  @ApiProperty()
  @AutoMap()
  public permissionIds?: string[];
}

export class GroupAssignPermissionsDTO {
  @ApiProperty()
  @AutoMap()
  public permissionIds!: PermissionIdentifier[];
}

export class GroupAssignMembersDTO {
  @ApiProperty()
  @AutoMap()
  public userIds!: User['id'][];
}

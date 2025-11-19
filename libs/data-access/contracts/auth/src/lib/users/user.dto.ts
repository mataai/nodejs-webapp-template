import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { Group } from '@webapp-template/database';

import { GroupDTO } from '../authorization';

export class UserBaseDTO {
  @ApiProperty()
  @AutoMap()
  public id!: string;
  @ApiProperty({
    example: 'exemple@exemple.ca',
    type: String,
    format: 'email',
  })
  @AutoMap()
  public email!: string;
  @ApiProperty()
  @AutoMap()
  public displayName?: string;
}
export class UserDTO extends UserBaseDTO {
  @ApiProperty()
  @AutoMap()
  public groups: GroupDTO[] = [];
}
export class UserRegisterDTO {
  @ApiProperty({
    example: 'exemple@exemple.ca',
    type: String,
    format: 'email',
  })
  @AutoMap()
  public email!: string;
  @ApiProperty()
  public password!: string;
  @ApiProperty()
  @AutoMap()
  public displayName?: string;
}
export class UserCreateRequestDTO {
  @ApiProperty({
    example: 'exemple@exemple.ca',
    type: String,
    format: 'email',
  })
  @AutoMap()
  public email!: string;
  @ApiProperty()
  @AutoMap()
  public displayName!: string;
  @ApiProperty()
  @AutoMap()
  public password!: string;
}

export class UserUpdateRequestDTO {
  @ApiProperty({
    example: 'exemple@exemple.ca',
    type: String,
    format: 'email',
  })
  @AutoMap()
  public email?: string;
  @ApiProperty()
  @AutoMap()
  public displayName?: string;
}

export class UserChangePasswordRequestDTO {
  @ApiProperty({
    format: 'password',
  })
  @AutoMap()
  public currentPassword!: string;
  @ApiProperty()
  @AutoMap()
  public newPassword!: string;
  @ApiProperty()
  @AutoMap()
  public confirmPassword!: string;
}

export class UserAssignGroupsDTO {
  @ApiProperty()
  @AutoMap()
  public groupIds!: Group['id'][];
}

import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { Action } from '@webapp-template/database';

export class PermissionIdentifier {
  @ApiProperty()
  @AutoMap(() => String)
  public action!: Action;
  @ApiProperty()
  @AutoMap()
  public model!: string;
}

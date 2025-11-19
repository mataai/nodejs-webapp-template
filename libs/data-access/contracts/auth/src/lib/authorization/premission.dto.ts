import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

import { Action } from '@webapp-template/database';

export class PermissionDTO {
  @ApiProperty()
  @AutoMap()
  public description!: string;

  @ApiProperty({
    enum: Action,
  })
  @AutoMap(() => String)
  public action!: Action;

  @ApiProperty()
  @AutoMap()
  public model!: string;
}

export class PermissionCreateRequestDTO {
  @ApiProperty()
  @AutoMap()
  public description!: string;

  @ApiProperty({
    enum: Action,
  })
  @AutoMap()
  public action!: Action;

  @ApiProperty()
  @AutoMap()
  public model!: string;
}

export class PermissionUpdateRequestDTO {
  @ApiProperty()
  @AutoMap()
  public description?: string;
}

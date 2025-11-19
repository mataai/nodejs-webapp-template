import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

export class OperationResponseDto<T extends object = object> {
  @ApiProperty()
  @AutoMap()
  public success!: boolean;

  @ApiProperty()
  @AutoMap()
  public message!: string;

  @ApiProperty()
  @AutoMap()
  public data!: T;
}

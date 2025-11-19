import { ApiProperty } from '@nestjs/swagger';

import { AutoMap } from '@automapper/classes';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  @AutoMap()
  public data!: T[];

  @ApiProperty()
  @AutoMap()
  public total!: number;

  @ApiProperty()
  @AutoMap()
  public page!: number;

  @ApiProperty()
  @AutoMap()
  public pageSize!: number;

  constructor(data: T[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
  }
}

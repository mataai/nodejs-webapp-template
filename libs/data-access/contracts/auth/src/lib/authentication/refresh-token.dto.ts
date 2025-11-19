import { ApiProperty } from '@nestjs/swagger';

export abstract class RefreshTokenRequestDTO {
  @ApiProperty()
  public refreshToken!: string;
}

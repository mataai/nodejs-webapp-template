import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadDTO {
  @ApiProperty()
  public id: string;
  @ApiProperty({
    pattern: 'email',
  })
  public email: string;
  constructor(user: { id: string; email: string }) {
    this.id = user.id;
    this.email = user.email;
  }
}

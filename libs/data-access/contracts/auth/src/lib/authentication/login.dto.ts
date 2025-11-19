import { ApiProperty } from '@nestjs/swagger';

/**
 * The request the login endpoint expects from the user to validate their credentials and log them in.
 */
export abstract class LoginRequestDTO {
  @ApiProperty({
    example: 'exemple@exemple.ca',
    type: String,
    format: 'email',
  })
  public email!: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'The password of the user',
    required: true,
  })
  public password!: string;
}

/**
 * The response the login endpoint reponds to the user once their credentials have been validated and they are logged in.
 */
export class LoginResponseDTO {
  @ApiProperty({
    example:
      'eyJhbGciOiJExampleAccessTokenIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
    description: 'The access token',
    required: true,
  })
  public accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1ExampleRefreshTokenNiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
    description: 'The refresh token',
    required: true,
  })
  public refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

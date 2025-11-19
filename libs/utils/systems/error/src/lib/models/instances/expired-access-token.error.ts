import { HttpStatus, Systems } from '@webapp-template/enums';

import { CustomError } from '../custom.error';

export class ExpiredAccessTokenError extends CustomError {
  constructor() {
    super(
      Systems.BE_AUTH,
      'ACCESS-TOKEN_EXPIRED',
      'The provided access token has expired',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

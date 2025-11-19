import { HttpException } from '@nestjs/common';

import { HttpStatus, Systems } from '@webapp-template/enums';

export class CustomError extends HttpException {
  /**
   * @param systemCode The stardard code for the system that threw the error. Ex: 'FE_AUTH', 'BE_TOURNAMENTS', etc.
   * @param errorCode The specific error code for the error that was thrown. Ex: 'INVALID_CREDENTIALS', 'TOURNAMENT_NOT_FOUND', etc.
   * @param errorMessage Human readable error message in english in case error code dosen't exist in frontend translations or the error code is not clear enough.
   * @param httpErrorCode The http status code that should be returned to the client. Default is 500.
   * @param stackTrace The stack trace of the error if it can be usefull for debugging or maybe in frontend logs.
   */
  constructor(
    systemCode: Systems,
    errorCode: string,
    errorMessage: string,
    httpErrorCode?: HttpStatus,
    stackTrace?: string,
  ) {
    super(
      {
        systemCode,
        errorCode,
        errorMessage,
        stackTrace,
      },
      httpErrorCode || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

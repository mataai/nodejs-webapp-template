import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  LoginRequestDTO,
  LoginResponseDTO,
  RefreshTokenRequestDTO,
  UserRegisterDTO,
} from '@webapp-template/auth-contracts';
import { User } from '@webapp-template/database';

import { RequestUser } from '../../../core/decorators/user.decorator';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthenticationService) {}

  @ApiAcceptedResponse({
    description:
      'This action logs the user in and returns the access token and refresh token',
    type: LoginResponseDTO,
  })
  @ApiBadRequestResponse({
    description:
      'This action returns a 401 Unauthorized if the credentials are invalid',
  })
  @Post('login')
  public login(
    @Body() loginRequest: LoginRequestDTO,
  ): Promise<LoginResponseDTO> {
    return this._authService.signIn(loginRequest.email, loginRequest.password);
  }

  @Post('refresh')
  @ApiAcceptedResponse({
    description:
      'This action refreshes the access token and returns a new access token and refresh token',
    type: LoginResponseDTO,
  })
  public refresh(
    @Body() body: RefreshTokenRequestDTO,
  ): Promise<LoginResponseDTO> {
    return this._authService.refresh(body);
  }

  @Post('register')
  public register(@Body() request: UserRegisterDTO): Promise<LoginResponseDTO> {
    return this._authService.register(request);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  public profile(@RequestUser() user?: User): unknown {
    return user;
  }
}

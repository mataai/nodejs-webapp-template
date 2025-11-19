import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { randomUUID } from 'crypto';

import {
  LoginResponseDTO,
  RefreshTokenRequestDTO,
  UserRegisterDTO,
} from '@webapp-template/auth-contracts';
import { SystemAuthor, User } from '@webapp-template/database';

import { UsersService } from '../users/users.service';
import { hashPassword } from '../utils/password-hasher';

@Injectable()
export class AuthenticationService {
  constructor(
    private _usersService: UsersService,
    private _jwtService: JwtService,
  ) {}

  public async validateUser(
    username: string,
    pass: string,
  ): Promise<User | null> {
    const user = await this._usersService.findOneById(username);
    if (user && user.password === pass) {
      delete user.password;
      return user;
    }
    return null;
  }

  public async signIn(email: string, pass: string): Promise<LoginResponseDTO> {
    const user = await this._usersService.findOneForLogin(email);
    const hash = hashPassword(pass);
    if (!user || user?.password !== hash) {
      throw new BadRequestException();
    }

    const access_token = await this.generateAccessToken(user);
    const refresh_token = await this.generateRefreshToken(user);

    return new LoginResponseDTO(access_token, refresh_token);
  }

  public async refresh(
    body: RefreshTokenRequestDTO,
  ): Promise<LoginResponseDTO> {
    // 1 check if the refresh token not expired
    let tokenData;
    try {
      tokenData = this._jwtService.verify(body.refreshToken);
    } catch (e) {
      throw new UnauthorizedException();
    }
    // TODO 2 check if token id is blocked in the database (EX if we implement a user ban system)

    // 3 check if the user is still valid
    const user: User = await this._usersService.findOneById(tokenData.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    // 4 generate a new access token
    return new LoginResponseDTO(
      await this.generateAccessToken(user),
      await this.generateRefreshToken(user),
    );
  }

  public async register(data: UserRegisterDTO): Promise<LoginResponseDTO> {
    const user = await this._usersService.createUser(
      {
        email: data.email,
        displayName: data.displayName || data.email.split('@')[0],
        password: hashPassword(data.password),
      },
      SystemAuthor,
    );

    const access_token = await this.generateAccessToken(user);
    const refresh_token = await this.generateRefreshToken(user);

    return new LoginResponseDTO(access_token, refresh_token);
  }

  private generateAccessToken(user: User): Promise<string> {
    const tokenPayload = { sub: user.id, displayName: user.displayName };
    return this._jwtService.signAsync(tokenPayload, { expiresIn: '3h' });
  }

  private generateRefreshToken(user: User): Promise<string> {
    const tokenId = randomUUID();
    const tokenPayload = { sub: user.id, tokenId: tokenId };
    return this._jwtService.signAsync(tokenPayload, { expiresIn: '7d' });
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayloadDTO } from '@webapp-template/auth-contracts';
import { User } from '@webapp-template/database';

import { UsersService } from '../../users/users.service';

/**
 * This class is a strategy for Passport that uses JWT tokens for authentication.
 * A strategy is a check that is performed on the request to determine if it respects certain rules.
 * In this case, the rule is that the request must have a valid JWT token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private _userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public validate(tokenPayload: {
    sub: User['id'];
    displayName: User['displayName'];
    iat: number;
    exp: number;
  }): Promise<TokenPayloadDTO> {
    return this._userService.findOneForGuard(tokenPayload.sub);
  }
}

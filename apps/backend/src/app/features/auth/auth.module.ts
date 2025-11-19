import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '@webapp-template/database';

import { MappingModule } from '../../core/mapping/mapping.module';
import {
  AuthController,
  AuthenticationService,
  AuthGuard,
  JwtStrategy,
  LocalStrategy,
} from './authentication';
import {
  AuthorizationService,
  CaslAbilityFactory,
  GroupsController,
  PermissionsController,
  PoliciesGuard,
} from './authorization';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  controllers: [
    AuthController,
    UsersController,
    GroupsController,
    PermissionsController,
  ],
  imports: [
    DatabaseModule,
    PassportModule,
    MappingModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    CaslAbilityFactory,
    LocalStrategy,
    JwtStrategy,
    AuthGuard,
    PoliciesGuard,
    AuthenticationService,
    AuthorizationService,
    UsersService,
  ],
})
export class AuthModule {}

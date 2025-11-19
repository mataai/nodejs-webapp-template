import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '@webapp-template/database';

import { MappingModule } from './core/mapping/mapping.module';
import { AuthModule } from './features/auth/auth.module';
import { TournamentsModule } from './features/tournament/tournament.module';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    MappingModule.forRoot(),
    ConfigModule.forRoot(),
    AuthModule,
    TournamentsModule,
  ],
})
export class AppModule {}

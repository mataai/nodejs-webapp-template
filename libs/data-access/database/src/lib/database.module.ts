import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceOptions } from './data-source.config';
import { DatabaseHistoryService } from './database-history.service';
import { AuthorizationsDAL, UsersDAL } from './features';

@Module({
  providers: [UsersDAL, AuthorizationsDAL, DatabaseHistoryService],
  exports: [UsersDAL, AuthorizationsDAL],
})
export class DatabaseModule {
  public static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forRoot(dataSourceOptions)],
    };
  }
}

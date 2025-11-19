import { Injectable } from '@nestjs/common';

import { DataSource, DeepPartial, Repository } from 'typeorm';

import {
  GroupLogs,
  PermissionLogs,
  TranslatedStringLogs,
  UserLogs,
} from './features/logs';

@Injectable()
export class DatabaseHistoryService {
  constructor(private _dataSource: DataSource) {}

  private get _userLogsRepository(): Repository<UserLogs> {
    return this._dataSource.getRepository(UserLogs);
  }

  private get _permissionsLogsRepository(): Repository<PermissionLogs> {
    return this._dataSource.getRepository(PermissionLogs);
  }

  private get _groupLogsRepository(): Repository<GroupLogs> {
    return this._dataSource.getRepository(GroupLogs);
  }

  private get _translatedStringLogsRepository(): Repository<TranslatedStringLogs> {
    return this._dataSource.getRepository(TranslatedStringLogs);
  }

  public createUserLog(data: DeepPartial<UserLogs>): Promise<UserLogs> {
    const generatedLog = this._userLogsRepository.create(data);
    return this._userLogsRepository.save(generatedLog);
  }

  public createPermissionLog(
    data: DeepPartial<PermissionLogs>
  ): Promise<PermissionLogs> {
    const generatedLog = this._permissionsLogsRepository.create(data);
    return this._permissionsLogsRepository.save(generatedLog);
  }

  public createGroupLog(data: DeepPartial<GroupLogs>): Promise<GroupLogs>;
  public createGroupLog(data: DeepPartial<GroupLogs>[]): Promise<GroupLogs[]>;
  public createGroupLog(
    data: DeepPartial<GroupLogs> | DeepPartial<GroupLogs>[]
  ): Promise<GroupLogs | GroupLogs[]> {
    const generatedLog = this._groupLogsRepository.create(
      Array.isArray(data) ? data : [data]
    );
    const result = this._groupLogsRepository.save(generatedLog);
    return Array.isArray(data) ? result : result.then((x) => x[0]);
  }

  public createTranslatedStringLog(
    data: DeepPartial<TranslatedStringLogs>
  ): Promise<TranslatedStringLogs> {
    const generatedLog = this._translatedStringLogsRepository.create(data);
    return this._translatedStringLogsRepository.save(generatedLog);
  }
}
